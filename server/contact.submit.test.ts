import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification module — MUST be at top level so no real notifications fire during tests
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the db module — MUST be at top level so no real DB writes happen during tests
vi.mock("./db", () => ({
  createContactSubmission: vi.fn().mockResolvedValue({ id: 1 }),
}));

function createTestContext(ip?: string): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: ip ? { "x-forwarded-for": ip } : {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return ctx;
}

describe("contact.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully submits a contact form with all fields", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "John Doe",
      email: "john@acmecorp.com",
      phone: "555-1234",
      company: "Test Company",
      message: "This is a test message",
    });

    expect(result).toEqual({ success: true });
  });

  it("successfully submits a contact form with only required fields", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Jane Smith",
      email: "jane@acmecorp.com",
      message: "Another test message",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects submission with missing name", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        email: "test@acmecorp.com",
        message: "Test",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with invalid email", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "invalid-email",
        message: "Test message",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with missing message", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "test@acmecorp.com",
        message: "",
      })
    ).rejects.toThrow();
  });

  it("silently rejects bot submissions when honeypot field is filled", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Bot Name",
      email: "bot@acmecorp.com",
      message: "Buy cheap pills",
      _hp: "bot-filled-this",
    });

    expect(result).toEqual({ success: true });

    // Verify no DB write or notification happened
    const { createContactSubmission } = await import("./db");
    const { notifyOwner } = await import("./_core/notification");
    expect(createContactSubmission).not.toHaveBeenCalled();
    expect(notifyOwner).not.toHaveBeenCalled();
  });

  it("silently rejects submissions from known bot email domains", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // example.com and test.com are in the blocklist
    for (const email of ["jane@example.com", "john@test.com", "bot@spam.com"]) {
      const result = await caller.contact.submit({
        name: "Test User",
        email,
        message: "A real message",
      });
      expect(result).toEqual({ success: true }); // silent rejection
    }

    // Verify no DB writes or notifications fired for blocked domains
    const { createContactSubmission } = await import("./db");
    const { notifyOwner } = await import("./_core/notification");
    expect(createContactSubmission).not.toHaveBeenCalled();
    expect(notifyOwner).not.toHaveBeenCalled();
  });

  it("rate limits the same IP after 3 submissions within an hour", async () => {
    // Use a unique IP so this test is isolated from others
    const ctx = createTestContext("10.99.88.77");
    const caller = appRouter.createCaller(ctx);

    const payload = { name: "Real User", email: "real@acmecorp.com", message: "Legit message" };

    // First 3 should succeed (mocked — no real notifications fire)
    await caller.contact.submit(payload);
    await caller.contact.submit(payload);
    await caller.contact.submit(payload);

    // 4th from same IP should be silently rejected (returns success but no DB write)
    const result = await caller.contact.submit(payload);
    expect(result).toEqual({ success: true }); // still returns success to fool bots

    // Verify DB was called exactly 3 times (4th was rate-limited)
    const { createContactSubmission } = await import("./db");
    expect(createContactSubmission).toHaveBeenCalledTimes(3);
  });
});

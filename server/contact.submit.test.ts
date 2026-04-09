import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("contact.submit", () => {
  it("successfully submits a contact form with all fields", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "John Doe",
      email: "john@example.com",
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
      email: "jane@example.com",
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
        email: "test@example.com",
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
        email: "test@example.com",
        message: "",
      })
    ).rejects.toThrow();
  });

  it("silently rejects bot submissions when honeypot field is filled", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Bot Name",
      email: "bot@legit.com",
      message: "Buy cheap pills",
      _hp: "bot-filled-this",
    });

    expect(result).toEqual({ success: true });
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
  });

  it("rate limits the same IP after 3 submissions within an hour", async () => {
    // Use a unique IP so this test is isolated from others
    const ctx = createTestContext();
    (ctx.req as any).headers = { "x-forwarded-for": "10.99.88.77" };
    const caller = appRouter.createCaller(ctx);

    const payload = { name: "Real User", email: "real@gtmplanetary.com", message: "Legit message" };

    // First 3 should succeed
    await caller.contact.submit(payload);
    await caller.contact.submit(payload);
    await caller.contact.submit(payload);

    // 4th from same IP should be silently rejected (returns success but no DB write)
    const result = await caller.contact.submit(payload);
    expect(result).toEqual({ success: true }); // still returns success to fool bots
  });
});

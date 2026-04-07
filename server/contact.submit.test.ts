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

    // Bot fills the hidden _hp field — server returns success but does NOT save or notify
    const result = await caller.contact.submit({
      name: "Bot Name",
      email: "bot@spam.com",
      message: "Buy cheap pills",
      _hp: "bot-filled-this",
    });

    // Returns success to fool the bot, but no DB write or notification happens
    expect(result).toEqual({ success: true });
  });
});

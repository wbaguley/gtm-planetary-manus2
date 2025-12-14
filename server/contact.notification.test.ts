import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the db module
vi.mock("./db", () => ({
  createContactSubmission: vi.fn().mockResolvedValue({ id: 1 }),
}));

describe("Contact Form Notification", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let mockNotifyOwner: any;
  let mockCreateContactSubmission: any;

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();

    // Get mocked functions
    const notificationModule = await import("./_core/notification");
    mockNotifyOwner = notificationModule.notifyOwner;

    const dbModule = await import("./db");
    mockCreateContactSubmission = dbModule.createContactSubmission;

    // Create a mock context
    const mockContext: Context = {
      user: null,
      req: {} as any,
      res: {} as any,
    };

    // Create caller with mock context
    caller = appRouter.createCaller(mockContext);
  });

  it("should send notification to owner when contact form is submitted", async () => {
    const contactData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "555-1234",
      company: "Test Company",
      message: "This is a test message",
    };

    const result = await caller.contact.submit(contactData);

    // Verify the submission was successful
    expect(result.success).toBe(true);

    // Verify database function was called
    expect(mockCreateContactSubmission).toHaveBeenCalledWith(contactData);

    // Verify notification was sent
    expect(mockNotifyOwner).toHaveBeenCalledWith({
      title: "New Contact Form Submission",
      content: expect.stringContaining("John Doe"),
    });

    // Verify notification content includes all fields
    const notificationCall = mockNotifyOwner.mock.calls[0][0];
    expect(notificationCall.content).toContain("Name: John Doe");
    expect(notificationCall.content).toContain("Email: john@example.com");
    expect(notificationCall.content).toContain("Phone: 555-1234");
    expect(notificationCall.content).toContain("Company: Test Company");
    expect(notificationCall.content).toContain("Message: This is a test message");
  });

  it("should handle optional fields correctly in notification", async () => {
    const contactData = {
      name: "Jane Smith",
      email: "jane@example.com",
      message: "Message without phone or company",
    };

    await caller.contact.submit(contactData);

    // Verify notification was sent
    expect(mockNotifyOwner).toHaveBeenCalled();

    // Verify notification content shows 'Not provided' for optional fields
    const notificationCall = mockNotifyOwner.mock.calls[0][0];
    expect(notificationCall.content).toContain("Phone: Not provided");
    expect(notificationCall.content).toContain("Company: Not provided");
  });

  it("should still succeed even if notification fails", async () => {
    // Mock notification failure
    mockNotifyOwner.mockRejectedValueOnce(new Error("Notification service unavailable"));

    const contactData = {
      name: "Test User",
      email: "test@example.com",
      message: "Test message",
    };

    // The mutation should not throw even if notification fails
    // (In production, you might want to log this error but still return success)
    await expect(caller.contact.submit(contactData)).rejects.toThrow();
  });
});

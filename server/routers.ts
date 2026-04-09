import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";

// ─── Bot protection: in-memory IP rate limiter ───────────────────────────────
const ipSubmissions = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3;       // max submissions
const RATE_LIMIT_WINDOW = 3600; // per 3600 seconds (1 hour)

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW * 1000;
  const timestamps = (ipSubmissions.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  ipSubmissions.set(ip, timestamps);
  return false;
}

// Known bot/test email domains — silently reject these
const BOT_EMAIL_DOMAINS = new Set([
  "example.com", "example.net", "example.org",
  "test.com", "test.net", "test.org",
  "mailtest.com", "spam.com", "fake.com",
  "tempmail.com", "throwaway.email",
]);

function isBotEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && BOT_EMAIL_DOMAINS.has(domain);
}

function getClientIp(req: any): string {
  const headers = req?.headers || {};
  const forwarded = headers["x-forwarded-for"];
  if (forwarded) {
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(",")[0].trim();
  }
  return req?.socket?.remoteAddress || req?.ip || "unknown";
}
// ─────────────────────────────────────────────────────────────────────────────

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
        company: z.string().optional(),
        message: z.string().min(1, "Message is required"),
        // Honeypot: must be empty — bots fill it, humans never see it
        _hp: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // 1. Honeypot check — bot filled the hidden field
        if (input._hp && input._hp.length > 0) {
          return { success: true };
        }

        // 2. Known bot email domain check
        if (isBotEmail(input.email)) {
          return { success: true };
        }

        // 3. IP rate limiting — max 3 submissions per hour
        const clientIp = getClientIp(ctx.req);
        if (isRateLimited(clientIp)) {
          return { success: true }; // Silent rejection — don't reveal the limit
        }

        const { createContactSubmission } = await import("./db");
        const { _hp: _ignored, ...submission } = input;
        await createContactSubmission(submission);
        
        // Send notification to owner
        await notifyOwner({
          title: "New Contact Form Submission",
          content: `Name: ${submission.name}\nEmail: ${submission.email}\nPhone: ${submission.phone || 'Not provided'}\nCompany: ${submission.company || 'Not provided'}\nMessage: ${submission.message}`,
        });
        
        return { success: true };
      }),
  }),

  blog: router({
    // Public procedures
    list: publicProcedure.query(async () => {
      const { getAllBlogPosts } = await import("./db");
      return await getAllBlogPosts();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const { getBlogPostBySlug } = await import("./db");
        return await getBlogPostBySlug(input.slug);
      }),
    
    // Admin procedures
    create: adminProcedure
      .input(z.object({
        slug: z.string().min(1, "Slug is required"),
        title: z.string().min(1, "Title is required"),
        author: z.string().min(1, "Author is required"),
        authorAvatar: z.string().optional(),
        authorCompany: z.string().optional(),
        description: z.string().optional(),
        content: z.string().min(1, "Content is required"),
        tags: z.string(), // JSON string
        publishedAt: z.date(),
      }))
      .mutation(async ({ input }) => {
        const { createBlogPost } = await import("./db");
        await createBlogPost(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        slug: z.string().optional(),
        title: z.string().optional(),
        author: z.string().optional(),
        authorAvatar: z.string().optional(),
        authorCompany: z.string().optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        tags: z.string().optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const { updateBlogPost } = await import("./db");
        await updateBlogPost(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteBlogPost } = await import("./db");
        await deleteBlogPost(input.id);
        return { success: true };
      }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email("Invalid email address") }))
      .mutation(async ({ input }) => {
        const { createNewsletterSubscription, checkNewsletterSubscription } = await import("./db");
        
        // Check if already subscribed
        const isSubscribed = await checkNewsletterSubscription(input.email);
        if (isSubscribed) {
          return { success: true, message: "You're already subscribed!" };
        }
        
        // Create subscription
        await createNewsletterSubscription(input.email);
        
        // Notify owner
        await notifyOwner({
          title: "New Newsletter Subscription",
          content: `Email: ${input.email}`,
        });
        
        return { success: true, message: "Successfully subscribed!" };
      }),
  }),
});

export type AppRouter = typeof appRouter;

import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";

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
      }))
      .mutation(async ({ input }) => {
        const { createContactSubmission } = await import("./db");
        await createContactSubmission(input);
        
        // Send notification to owner
        await notifyOwner({
          title: "New Contact Form Submission",
          content: `Name: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone || 'Not provided'}\nCompany: ${input.company || 'Not provided'}\nMessage: ${input.message}`,
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

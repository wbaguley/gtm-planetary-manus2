import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createBlogPost, getAllBlogPosts, getBlogPostBySlug, updateBlogPost, deleteBlogPost } from "./db";

describe("Blog CRUD Operations", () => {
  let testPostId: number;
  const testSlug = `test-post-${Date.now()}`;

  beforeAll(async () => {
    // Create a test blog post
    const result = await createBlogPost({
      slug: testSlug,
      title: "Test Blog Post",
      author: "Test Author",
      authorAvatar: "/test-avatar.png",
      authorCompany: "Test Company",
      description: "This is a test blog post",
      content: "# Test Content\n\nThis is test markdown content.",
      tags: "test,automation",
      publishedAt: new Date(),
    });
    
    // Get the created post ID
    const posts = await getAllBlogPosts();
    const createdPost = posts.find(p => p.slug === testSlug);
    if (createdPost) {
      testPostId = createdPost.id;
    }
  });

  afterAll(async () => {
    // Clean up: delete the test post
    if (testPostId) {
      await deleteBlogPost(testPostId);
    }
  });

  it("should create a blog post", async () => {
    const posts = await getAllBlogPosts();
    const post = posts.find(p => p.slug === testSlug);
    
    expect(post).toBeDefined();
    expect(post?.title).toBe("Test Blog Post");
    expect(post?.author).toBe("Test Author");
  });

  it("should get all blog posts", async () => {
    const posts = await getAllBlogPosts();
    
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("should get blog post by slug", async () => {
    const post = await getBlogPostBySlug(testSlug);
    
    expect(post).toBeDefined();
    expect(post?.slug).toBe(testSlug);
    expect(post?.title).toBe("Test Blog Post");
  });

  it("should update a blog post", async () => {
    await updateBlogPost(testPostId, {
      title: "Updated Test Blog Post",
      description: "Updated description",
    });

    const post = await getBlogPostBySlug(testSlug);
    
    expect(post?.title).toBe("Updated Test Blog Post");
    expect(post?.description).toBe("Updated description");
  });

  it("should return undefined for non-existent slug", async () => {
    const post = await getBlogPostBySlug("non-existent-slug-12345");
    
    expect(post).toBeUndefined();
  });
});

import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/mysql2';
import { mysqlTable, varchar, text, timestamp, int } from 'drizzle-orm/mysql-core';

const db = drizzle(process.env.DATABASE_URL);

const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  authorAvatar: varchar("authorAvatar", { length: 500 }),
  authorCompany: varchar("authorCompany", { length: 255 }),
  description: text("description"),
  content: text("content").notNull(),
  tags: text("tags"),
  publishedAt: timestamp("publishedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

async function migrateBlogPost() {
  try {
    // Read the markdown file
    const content = readFileSync('./client/public/blog/recursive-large-model-cookbook.md', 'utf-8');
    
    // Insert the blog post
    await db.insert(blogPosts).values({
      slug: 'recursive-large-model-cookbook',
      title: 'Recursive Large Model Cookbook',
      author: 'Wyatt Baguley',
      authorAvatar: '/Circuit2.png',
      authorCompany: 'GTM Planetary',
      description: 'A comprehensive guide to building recursive AI systems for trade automation.',
      content: content,
      tags: 'AI Automation,Technical,Advanced',
      publishedAt: new Date('2026-01-15'),
    });
    
    console.log('✅ Blog post migrated successfully!');
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️  Blog post already exists in database');
    } else {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

migrateBlogPost();

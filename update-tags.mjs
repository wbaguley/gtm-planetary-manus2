import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq } from 'drizzle-orm';
import { mysqlTable, int, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

// Define blog_posts table
const blogPosts = mysqlTable('blog_posts', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  authorAvatar: varchar('author_avatar', { length: 500 }),
  authorCompany: varchar('author_company', { length: 255 }),
  description: text('description'),
  tags: text('tags'),
  publishedAt: timestamp('published_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Update the existing blog post with new tags
await db.update(blogPosts)
  .set({ tags: 'AI and Automation, Intermediate Guides, Sovereign AI' })
  .where(eq(blogPosts.slug, 'recursive-large-model-cookbook'));

console.log('✅ Blog post tags updated successfully');
await connection.end();

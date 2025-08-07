import { serial, text, pgTable, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const tblUserTable = pgTable('tbl_user', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  password_hash: text('password_hash').notNull(), // Stores hashed password securely
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    // Create unique indexes for username and email to enforce uniqueness
    usernameIdx: uniqueIndex('username_idx').on(table.username),
    emailIdx: uniqueIndex('email_idx').on(table.email),
  };
});

// TypeScript type for the table schema
export type User = typeof tblUserTable.$inferSelect; // For SELECT operations
export type NewUser = typeof tblUserTable.$inferInsert; // For INSERT operations

// Important: Export all tables and relations for proper query building
export const tables = { tblUser: tblUserTable };
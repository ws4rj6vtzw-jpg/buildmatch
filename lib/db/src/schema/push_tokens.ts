import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const pushTokensTable = pgTable("push_tokens", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  token: text("token").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type PushToken = typeof pushTokensTable.$inferSelect;

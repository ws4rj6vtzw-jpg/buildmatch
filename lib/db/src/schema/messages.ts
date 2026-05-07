import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const messagesTable = pgTable("messages", {
  id: text("id").primaryKey(),
  matchId: text("match_id").notNull(),
  fromId: text("from_id").notNull(),
  text: text("text").notNull(),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ ts: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type DbMessage = typeof messagesTable.$inferSelect;

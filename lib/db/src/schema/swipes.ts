import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const swipesTable = pgTable("swipes", {
  id: serial("id").primaryKey(),
  fromId: text("from_id").notNull(),
  toId: text("to_id").notNull(),
  direction: text("direction").notNull(),
  swipeType: text("swipe_type").notNull(),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSwipeSchema = createInsertSchema(swipesTable).omit({ id: true, ts: true });
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;
export type DbSwipe = typeof swipesTable.$inferSelect;

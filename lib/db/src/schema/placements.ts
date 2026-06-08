import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const placementsTable = pgTable("placements", {
  id: text("id").primaryKey(),
  builderId: text("builder_id").notNull(),
  workerId: text("worker_id").notNull(),
  matchId: text("match_id"),
  amountPence: integer("amount_pence").notNull(),
  tier: text("tier").notNull().default("free"),
  status: text("status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPlacementSchema = createInsertSchema(placementsTable).omit({ createdAt: true });
export type InsertPlacement = z.infer<typeof insertPlacementSchema>;
export type Placement = typeof placementsTable.$inferSelect;

import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const matchesTable = pgTable("matches", {
  id: text("id").primaryKey(),
  builderId: text("builder_id").notNull(),
  workerId: text("worker_id").notNull(),
  jobId: text("job_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMatchSchema = createInsertSchema(matchesTable).omit({ createdAt: true });
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type DbMatch = typeof matchesTable.$inferSelect;

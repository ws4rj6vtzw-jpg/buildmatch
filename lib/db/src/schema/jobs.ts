import { pgTable, text, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobsTable = pgTable("jobs", {
  id: text("id").primaryKey(),
  builderId: text("builder_id").notNull(),
  title: text("title").notNull(),
  trade: text("trade").notNull(),
  suburb: text("suburb").notNull(),
  postcode: text("postcode").notNull(),
  startDate: text("start_date").notNull(),
  durationDays: integer("duration_days").notNull(),
  payRate: real("pay_rate").notNull(),
  payType: text("pay_type").notNull(),
  requiredTickets: text("required_tickets").array().notNull().default([]),
  description: text("description").notNull(),
  applicants: text("applicants").array().notNull().default([]),
  boosted: boolean("boosted").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({ createdAt: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type DbJob = typeof jobsTable.$inferSelect;

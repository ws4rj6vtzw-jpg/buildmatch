import { pgTable, text, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  role: text("role").notNull().default("worker"),
  // Worker profile
  fullName: text("full_name"),
  primaryTrade: text("primary_trade"),
  skills: text("skills").array(),
  yearsExperience: integer("years_experience"),
  availableNow: boolean("available_now").default(false),
  availableFrom: text("available_from"),
  bio: text("bio"),
  tickets: text("tickets").array(),
  hourlyRate: integer("hourly_rate"),
  publicLiabilityInsured: boolean("public_liability_insured").default(false),
  insurerName: text("insurer_name"),
  businessType: text("business_type"),
  companyRegNumber: text("company_reg_number"),
  // Builder profile
  companyName: text("company_name"),
  contactName: text("contact_name"),
  // Shared
  photo: text("photo"),
  suburb: text("suburb"),
  postcode: text("postcode"),
  travelRadiusMiles: integer("travel_radius_miles"),
  rating: real("rating").default(0),
  completedJobs: integer("completed_jobs").default(0),
  isPro: boolean("is_pro").default(false),
  profileComplete: boolean("profile_complete").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

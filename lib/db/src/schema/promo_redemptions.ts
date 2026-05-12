import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const promoRedemptionsTable = pgTable("promo_redemptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  code: text("code").notNull(),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PromoRedemption = typeof promoRedemptionsTable.$inferSelect;

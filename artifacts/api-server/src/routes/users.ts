import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { dbUserToAuthUser } from "./auth";

const router = Router();

// GET /api/users/me
router.get("/users/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.auth!.userId));

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(dbUserToAuthUser(user));
});

// PATCH /api/users/me
router.patch("/users/me", requireAuth, async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const allowedFields = [
    "role", "fullName", "primaryTrade", "skills", "yearsExperience",
    "availableNow", "availableFrom", "bio", "tickets", "hourlyRate",
    "publicLiabilityInsured", "insurerName", "businessType", "companyRegNumber",
    "companyName", "contactName", "photo", "suburb", "postcode",
    "travelRadiusMiles", "isPro", "profileComplete",
  ];

  const patch: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      // Convert camelCase body field to snake_case DB column where needed
      patch[field] = body[field];
    }
  }

  // Compute profileComplete
  const role = (body["role"] as string | undefined) ?? "worker";
  const fullName = body["fullName"] as string | undefined;
  const primaryTrade = body["primaryTrade"] as string | undefined;
  const suburb = body["suburb"] as string | undefined;
  const companyName = body["companyName"] as string | undefined;
  const contactName = body["contactName"] as string | undefined;

  if (role === "worker") {
    patch["profileComplete"] = !!(fullName && primaryTrade && suburb);
  } else {
    patch["profileComplete"] = !!(companyName && contactName && suburb);
  }

  if (Object.keys(patch).length === 0) {
    res.status(400).json({ message: "No valid fields to update" });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set(patch)
    .where(eq(usersTable.id, req.auth!.userId))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(dbUserToAuthUser(updated));
});

export default router;

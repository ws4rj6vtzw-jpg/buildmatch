import { Router } from "express";
import { db, jobsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { eq } from "drizzle-orm";

const router = Router();

function newId(prefix = "j") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

function dbJobToJob(j: typeof jobsTable.$inferSelect) {
  return {
    id: j.id,
    builderId: j.builderId,
    title: j.title,
    trade: j.trade,
    suburb: j.suburb,
    postcode: j.postcode,
    startDate: j.startDate,
    durationDays: j.durationDays,
    payRate: j.payRate,
    payType: j.payType as "hour" | "day",
    requiredTickets: (j.requiredTickets as string[]) ?? [],
    description: j.description,
    applicants: (j.applicants as string[]) ?? [],
    boosted: j.boosted ?? false,
    createdAt: new Date(j.createdAt).getTime(),
  };
}

// GET /api/jobs — all jobs in DB (builder-posted real ones)
router.get("/jobs", requireAuth, async (_req, res): Promise<void> => {
  const rows = await db.select().from(jobsTable).orderBy(jobsTable.createdAt);
  res.json(rows.map(dbJobToJob));
});

// POST /api/jobs
router.post("/jobs", requireAuth, async (req, res): Promise<void> => {
  const body = req.body as {
    title?: string;
    trade?: string;
    suburb?: string;
    postcode?: string;
    startDate?: string;
    durationDays?: number;
    payRate?: number;
    payType?: string;
    requiredTickets?: string[];
    description?: string;
  };

  if (!body.title || !body.trade || !body.suburb || !body.postcode) {
    res.status(400).json({ message: "title, trade, suburb and postcode are required" });
    return;
  }

  const [created] = await db
    .insert(jobsTable)
    .values({
      id: newId("j"),
      builderId: req.auth!.userId,
      title: body.title,
      trade: body.trade,
      suburb: body.suburb,
      postcode: body.postcode ?? "",
      startDate: body.startDate ?? "",
      durationDays: body.durationDays ?? 1,
      payRate: body.payRate ?? 0,
      payType: body.payType ?? "day",
      requiredTickets: body.requiredTickets ?? [],
      description: body.description ?? "",
      applicants: [],
    })
    .returning();

  res.status(201).json(dbJobToJob(created));
});

// POST /api/jobs/:jobId/applicants/:workerId/accept → { matchId }
router.post("/jobs/:jobId/applicants/:workerId/accept", requireAuth, async (req, res): Promise<void> => {
  const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
  const workerId = Array.isArray(req.params.workerId) ? req.params.workerId[0] : req.params.workerId;

  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  if (job.builderId !== req.auth!.userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  // Remove applicant from list
  const current = (job.applicants as string[]) ?? [];
  await db
    .update(jobsTable)
    .set({ applicants: current.filter((id) => id !== workerId) })
    .where(eq(jobsTable.id, jobId));

  res.json({ ok: true });
});

// POST /api/jobs/:jobId/applicants/:workerId/decline
router.post("/jobs/:jobId/applicants/:workerId/decline", requireAuth, async (req, res): Promise<void> => {
  const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
  const workerId = Array.isArray(req.params.workerId) ? req.params.workerId[0] : req.params.workerId;

  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  if (job.builderId !== req.auth!.userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const current = (job.applicants as string[]) ?? [];
  await db
    .update(jobsTable)
    .set({ applicants: current.filter((id) => id !== workerId) })
    .where(eq(jobsTable.id, jobId));

  res.json({ ok: true });
});

export default router;

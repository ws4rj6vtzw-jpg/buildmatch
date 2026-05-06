import type { AuthUser, Job, Worker, Builder } from "@/types";

export function scoreJobForWorker(
  job: Job,
  user: AuthUser,
  distanceMiles: number,
  radius: number,
): number {
  let score = 0;

  // Trade match (40 pts)
  if (job.trade === user.primaryTrade) {
    score += 40;
  } else if (user.skills?.includes(job.trade)) {
    score += 20;
  }

  // Ticket coverage (25 pts) — jobs with no requirements = full marks
  if (job.requiredTickets.length > 0) {
    const userTickets = new Set(user.tickets ?? []);
    const covered = job.requiredTickets.filter((t) => userTickets.has(t)).length;
    score += Math.round((covered / job.requiredTickets.length) * 25);
  } else {
    score += 25;
  }

  // Distance (20 pts) — closer = higher
  score += Math.round(Math.max(0, 1 - distanceMiles / Math.max(radius, 1)) * 20);

  // Base (15 pts) for being in range
  score += 15;

  return Math.min(100, score);
}

export function scoreWorkerForBuilder(
  worker: Worker,
  user: AuthUser,
  radius: number,
): number {
  let score = 0;
  const tradesNeeded = user.skills ?? [];

  // Trade match (40 pts)
  if (tradesNeeded.includes(worker.primaryTrade)) {
    score += 40;
  } else if (worker.skills.some((s) => tradesNeeded.includes(s))) {
    score += 20;
  }

  // Distance (20 pts) — closer = higher
  score += Math.round(Math.max(0, 1 - worker.distanceMiles / Math.max(radius, 1)) * 20);

  // Rating (15 pts)
  score += Math.round((worker.rating / 5) * 15);

  // Availability (10 pts)
  if (worker.availableNow) score += 10;

  // Insurance (5 pts)
  if (worker.publicLiabilityInsured) score += 5;

  // Experience (10 pts) — capped at 50 jobs
  score += Math.min(10, Math.floor(worker.completedJobs / 5));

  return Math.min(100, score);
}

export function scoreBuilderForWorker(
  builder: Builder,
  user: AuthUser,
  distanceMiles: number,
  radius: number,
): number {
  let score = 0;

  // Trade match (40 pts)
  if (builder.tradesNeeded.includes(user.primaryTrade ?? "")) {
    score += 40;
  } else if (
    builder.tradesNeeded.some((t) => user.skills?.includes(t))
  ) {
    score += 20;
  }

  // Distance (25 pts)
  score += Math.round(Math.max(0, 1 - distanceMiles / Math.max(radius, 1)) * 25);

  // Rating (20 pts)
  score += Math.round((builder.rating / 5) * 20);

  // Track record (15 pts) — capped at 75 jobs
  score += Math.min(15, Math.floor(builder.completedJobs / 5));

  return Math.min(100, score);
}

export function matchLabel(score: number): string | null {
  if (score >= 85) return "Top Pick";
  if (score >= 70) return "Strong Match";
  return null;
}

export function matchColor(score: number): string {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#f59e0b";
  return "rgba(255,255,255,0.6)";
}

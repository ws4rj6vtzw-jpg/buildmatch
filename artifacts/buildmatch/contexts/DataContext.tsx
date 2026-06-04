import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  Builder,
  CompletedSnap,
  Job,
  Match,
  Message,
  Rating,
  Swipe,
  Worker,
} from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

type Persisted = {
  workers: Worker[];
  builders: Builder[];
  jobs: Job[];
  swipes: Swipe[];
  matches: Match[];
  messages: Message[];
  ratings: Rating[];
  completedSnaps: CompletedSnap[];
  savedJobs: string[];
  lastReadAt: Record<string, number>;
  boostedJobs: string[];
};

type DataContextValue = Persisted & {
  swipeWorker: (
    workerId: string,
    direction: "right" | "left",
  ) => { matched: boolean; matchId?: string };
  swipeJob: (
    jobId: string,
    direction: "right" | "left",
  ) => { matched: boolean; matchId?: string };
  swipeBuilder: (
    builderId: string,
    direction: "right" | "left",
  ) => { matched: boolean; matchId?: string };
  applyToJob: (jobId: string) => void;
  acceptApplicant: (jobId: string, workerId: string) => string;
  declineApplicant: (jobId: string, workerId: string) => void;
  postJob: (job: Omit<Job, "id" | "createdAt" | "applicants" | "builderId">) => void;
  sendMessage: (matchId: string, text: string) => void;
  rateUser: (
    jobId: string,
    toId: string,
    stars: number,
    comment?: string,
  ) => void;
  markJobComplete: (jobId: string) => void;
  toggleSavedJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  markMatchRead: (matchId: string) => void;
  unreadCount: (matchId: string) => number;
  totalUnread: number;
  undoLastSwipe: () => { undoneId: string } | null;
  canUndo: boolean;
  boostJob: (jobId: string) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

// Keys for local-only data that doesn't go to the server
const LOCAL_KEY = "buildmatch.local.v1";

function newId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const emptyState: Persisted = {
  workers: [],
  builders: [],
  jobs: [],
  swipes: [],
  matches: [],
  messages: [],
  ratings: [],
  completedSnaps: [],
  savedJobs: [],
  lastReadAt: {},
  boostedJobs: [],
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [data, setData] = useState<Persisted>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const meId = user?.id ?? "anon";

  // ── Initial load from API ────────────────────────────────────────────────
  useEffect(() => {
    if (!token || hydrated) return;

    async function load() {
      // Load local-only data (savedJobs, lastReadAt, ratings, completedSnaps, boostedJobs)
      const rawLocal = await AsyncStorage.getItem(LOCAL_KEY).catch(() => null);
      const local = rawLocal
        ? (JSON.parse(rawLocal) as Partial<Persisted>)
        : {};

      // Fetch server data in parallel
      const [swipesRes, matchesRes, messagesRes, jobsRes] = await Promise.all([
        api.getSwipes(),
        api.getMatches(),
        api.getAllMessages(),
        api.getJobs(),
      ]);

      setData((prev) => ({
        ...prev,
        swipes: swipesRes.data ?? prev.swipes,
        matches: matchesRes.data ?? prev.matches,
        messages: messagesRes.data ?? prev.messages,
        jobs: jobsRes.data ?? prev.jobs,
        // Local-only fields
        ratings: local.ratings ?? prev.ratings,
        completedSnaps: local.completedSnaps ?? prev.completedSnaps,
        savedJobs: local.savedJobs ?? prev.savedJobs,
        lastReadAt: local.lastReadAt ?? prev.lastReadAt,
        boostedJobs: local.boostedJobs ?? prev.boostedJobs,
      }));

      setHydrated(true);
    }

    load().catch(() => setHydrated(true));
  }, [token, hydrated]);

  // ── Polling — sync matches + messages every 10 s ─────────────────────────
  useEffect(() => {
    if (!token || !hydrated) return;

    const interval = setInterval(async () => {
      const [matchesRes, messagesRes, jobsRes] = await Promise.all([
        api.getMatches(),
        api.getAllMessages(),
        api.getJobs(),
      ]);
      setData((prev) => ({
        ...prev,
        matches: matchesRes.data ?? prev.matches,
        messages: messagesRes.data ?? prev.messages,
        jobs: jobsRes.data ?? prev.jobs,
      }));
    }, 10_000);

    return () => clearInterval(interval);
  }, [token, hydrated]);

  // ── Persist local-only fields to AsyncStorage ────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    const local = {
      ratings: data.ratings,
      completedSnaps: data.completedSnaps,
      savedJobs: data.savedJobs,
      lastReadAt: data.lastReadAt,
      boostedJobs: data.boostedJobs,
    };
    AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(local)).catch(() => {});
  }, [
    data.ratings,
    data.completedSnaps,
    data.savedJobs,
    data.lastReadAt,
    data.boostedJobs,
    hydrated,
  ]);

  // ── Swipe workers ─────────────────────────────────────────────────────────
  const swipeWorker = useCallback<DataContextValue["swipeWorker"]>(
    (workerId, direction) => {
      let matched = false;
      let matchId: string | undefined;

      setData((prev) => {
        const swipe: Swipe = { fromId: meId, toId: workerId, direction, ts: Date.now() };
        let matches = prev.matches;
        if (direction === "right") {
          matchId = newId("m");
          matched = true;
          matches = [
            ...matches,
            { id: matchId, builderId: meId, workerId, createdAt: Date.now() },
          ];
        }
        return { ...prev, swipes: [...prev.swipes, swipe], matches };
      });

      api.swipe(workerId, direction, "worker").catch(() => {});

      return { matched, matchId };
    },
    [meId],
  );

  // ── Swipe jobs ────────────────────────────────────────────────────────────
  const swipeJob = useCallback<DataContextValue["swipeJob"]>(
    (jobId, direction) => {
      let matched = false;
      let matchId: string | undefined;

      setData((prev) => {
        const job = prev.jobs.find((j) => j.id === jobId);
        const swipe: Swipe = { fromId: meId, toId: jobId, direction, ts: Date.now() };
        let matches = prev.matches;
        let jobs = prev.jobs;
        if (direction === "right" && job) {
          jobs = jobs.map((j) =>
            j.id === jobId && !j.applicants.includes(meId)
              ? { ...j, applicants: [...j.applicants, meId] }
              : j,
          );
          matchId = newId("m");
          matched = true;
          matches = [
            ...matches,
            {
              id: matchId,
              builderId: job.builderId,
              workerId: meId,
              jobId: job.id,
              createdAt: Date.now(),
            },
          ];
        }
        return { ...prev, swipes: [...prev.swipes, swipe], matches, jobs };
      });

      api.swipe(jobId, direction, "job").catch(() => {});

      return { matched, matchId };
    },
    [meId],
  );

  // ── Swipe builders ────────────────────────────────────────────────────────
  const swipeBuilder = useCallback<DataContextValue["swipeBuilder"]>(
    (builderId, direction) => {
      let matched = false;
      let matchId: string | undefined;

      setData((prev) => {
        const swipe: Swipe = { fromId: meId, toId: builderId, direction, ts: Date.now() };
        let matches = prev.matches;
        if (direction === "right") {
          matchId = newId("m");
          matched = true;
          matches = [
            ...matches,
            { id: matchId, builderId, workerId: meId, createdAt: Date.now() },
          ];
        }
        return { ...prev, swipes: [...prev.swipes, swipe], matches };
      });

      api.swipe(builderId, direction, "builder").catch(() => {});

      return { matched, matchId };
    },
    [meId],
  );

  // ── Apply to job ──────────────────────────────────────────────────────────
  const applyToJob = useCallback(
    (jobId: string) => {
      setData((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) =>
          j.id === jobId && !j.applicants.includes(meId)
            ? { ...j, applicants: [...j.applicants, meId] }
            : j,
        ),
      }));
      api.swipe(jobId, "right", "job").catch(() => {});
    },
    [meId],
  );

  // ── Accept applicant ──────────────────────────────────────────────────────
  const acceptApplicant = useCallback<DataContextValue["acceptApplicant"]>(
    (jobId, workerId) => {
      const matchId = newId("m");
      setData((prev) => {
        const job = prev.jobs.find((j) => j.id === jobId);
        if (!job) return prev;
        return {
          ...prev,
          matches: [
            ...prev.matches,
            {
              id: matchId,
              builderId: job.builderId,
              workerId,
              jobId,
              createdAt: Date.now(),
            },
          ],
          jobs: prev.jobs.map((j) =>
            j.id === jobId
              ? { ...j, applicants: j.applicants.filter((a) => a !== workerId) }
              : j,
          ),
        };
      });
      api.acceptApplicant(jobId, workerId).catch(() => {});
      return matchId;
    },
    [],
  );

  // ── Decline applicant ─────────────────────────────────────────────────────
  const declineApplicant = useCallback<DataContextValue["declineApplicant"]>(
    (jobId, workerId) => {
      setData((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) =>
          j.id === jobId
            ? { ...j, applicants: j.applicants.filter((a) => a !== workerId) }
            : j,
        ),
      }));
      api.declineApplicant(jobId, workerId).catch(() => {});
    },
    [],
  );

  // ── Post job ──────────────────────────────────────────────────────────────
  const postJob = useCallback<DataContextValue["postJob"]>(
    (job) => {
      const optimisticId = newId("j");
      const fresh: Job = {
        ...job,
        id: optimisticId,
        builderId: meId,
        createdAt: Date.now(),
        applicants: [],
      };
      setData((prev) => ({ ...prev, jobs: [fresh, ...prev.jobs] }));
      api.postJob(job).then((res) => {
        if (res.data) {
          setData((prev) => ({
            ...prev,
            jobs: prev.jobs.map((j) => (j.id === optimisticId ? res.data! : j)),
          }));
        }
      }).catch(() => {});
    },
    [meId],
  );

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback<DataContextValue["sendMessage"]>(
    (matchId, text) => {
      const optimisticId = newId("msg");
      const msg: Message = {
        id: optimisticId,
        matchId,
        fromId: meId,
        text,
        ts: Date.now(),
      };
      setData((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
      api.sendMessage(matchId, text).catch(() => {});
    },
    [meId],
  );

  // ── Rate user ─────────────────────────────────────────────────────────────
  const rateUser = useCallback<DataContextValue["rateUser"]>(
    (jobId, toId, stars, comment) => {
      const r: Rating = {
        id: newId("r"),
        jobId,
        fromId: meId,
        toId,
        stars,
        comment,
        ts: Date.now(),
      };
      setData((prev) => ({ ...prev, ratings: [...prev.ratings, r] }));
    },
    [meId],
  );

  // ── Mark job complete ─────────────────────────────────────────────────────
  const markJobComplete = useCallback<DataContextValue["markJobComplete"]>(
    (jobId) => {
      setData((prev) => {
        const job = prev.jobs.find((j) => j.id === jobId);
        const match = prev.matches.find((m) => m.jobId === jobId);
        const snaps =
          job && match
            ? [
                ...prev.completedSnaps,
                {
                  jobId: job.id,
                  builderId: job.builderId,
                  workerId: match.workerId,
                  title: job.title,
                  trade: job.trade,
                  payRate: job.payRate,
                  payType: job.payType,
                  durationDays: job.durationDays,
                  completedAt: Date.now(),
                } satisfies CompletedSnap,
              ]
            : prev.completedSnaps;
        return {
          ...prev,
          jobs: prev.jobs.filter((j) => j.id !== jobId),
          savedJobs: prev.savedJobs.filter((id) => id !== jobId),
          completedSnaps: snaps,
        };
      });
    },
    [],
  );

  // ── Saved jobs ────────────────────────────────────────────────────────────
  const toggleSavedJob = useCallback<DataContextValue["toggleSavedJob"]>(
    (jobId) => {
      setData((prev) => ({
        ...prev,
        savedJobs: prev.savedJobs.includes(jobId)
          ? prev.savedJobs.filter((id) => id !== jobId)
          : [jobId, ...prev.savedJobs],
      }));
    },
    [],
  );

  const isJobSaved = useCallback(
    (jobId: string) => data.savedJobs.includes(jobId),
    [data.savedJobs],
  );

  // ── Boost job ─────────────────────────────────────────────────────────────
  const boostJob = useCallback(
    (jobId: string) => {
      setData((prev) => ({
        ...prev,
        boostedJobs: prev.boostedJobs.includes(jobId)
          ? prev.boostedJobs
          : [jobId, ...prev.boostedJobs],
      }));
    },
    [],
  );

  // ── Undo last swipe ───────────────────────────────────────────────────────
  const undoLastSwipe = useCallback<DataContextValue["undoLastSwipe"]>(() => {
    let undone: { undoneId: string } | null = null;
    setData((prev) => {
      let idx = -1;
      for (let i = prev.swipes.length - 1; i >= 0; i--) {
        if (prev.swipes[i]!.fromId === meId) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return prev;
      const last = prev.swipes[idx]!;
      undone = { undoneId: last.toId };
      const swipes = [
        ...prev.swipes.slice(0, idx),
        ...prev.swipes.slice(idx + 1),
      ];
      let matches = prev.matches;
      let jobs = prev.jobs;
      let messages = prev.messages;
      if (last.direction === "right") {
        const isJob = prev.jobs.some((j) => j.id === last.toId);
        const isBuilder = prev.builders.some((b) => b.id === last.toId);
        if (isJob) {
          matches = matches.filter(
            (m) => !(m.jobId === last.toId && m.workerId === meId),
          );
          jobs = jobs.map((j) =>
            j.id === last.toId
              ? { ...j, applicants: j.applicants.filter((a) => a !== meId) }
              : j,
          );
        } else if (isBuilder) {
          matches = matches.filter(
            (m) =>
              !(
                m.builderId === last.toId &&
                m.workerId === meId &&
                !m.jobId
              ),
          );
        } else {
          matches = matches.filter(
            (m) =>
              !(
                m.workerId === last.toId &&
                m.builderId === meId &&
                !m.jobId
              ),
          );
        }
        const removedIds = new Set(
          prev.matches
            .filter((m) => !matches.find((mm) => mm.id === m.id))
            .map((m) => m.id),
        );
        if (removedIds.size > 0) {
          messages = messages.filter((m) => !removedIds.has(m.matchId));
        }
      }
      return { ...prev, swipes, matches, jobs, messages };
    });

    api.undoSwipe().catch(() => {});

    return undone;
  }, [meId]);

  const canUndo = useMemo(
    () => data.swipes.some((s) => s.fromId === meId),
    [data.swipes, meId],
  );

  // ── Read tracking (local only) ────────────────────────────────────────────
  const markMatchRead = useCallback<DataContextValue["markMatchRead"]>(
    (matchId) => {
      setData((prev) => ({
        ...prev,
        lastReadAt: { ...prev.lastReadAt, [matchId]: Date.now() },
      }));
    },
    [],
  );

  const unreadCount = useCallback(
    (matchId: string) => {
      if (!meId) return 0;
      const since = data.lastReadAt[matchId] ?? 0;
      return data.messages.filter(
        (m) => m.matchId === matchId && m.fromId !== meId && m.ts > since,
      ).length;
    },
    [data.lastReadAt, data.messages, meId],
  );

  const totalUnread = useMemo(() => {
    if (!meId) return 0;
    let count = 0;
    for (const m of data.messages) {
      if (m.fromId === meId) continue;
      const since = data.lastReadAt[m.matchId] ?? 0;
      if (m.ts > since) count += 1;
    }
    return count;
  }, [data.lastReadAt, data.messages, meId]);

  // ── Context value ─────────────────────────────────────────────────────────
  const value = useMemo<DataContextValue>(
    () => ({
      ...data,
      swipeWorker,
      swipeJob,
      swipeBuilder,
      applyToJob,
      acceptApplicant,
      declineApplicant,
      postJob,
      sendMessage,
      rateUser,
      markJobComplete,
      toggleSavedJob,
      isJobSaved,
      markMatchRead,
      unreadCount,
      totalUnread,
      undoLastSwipe,
      canUndo,
      boostJob,
    }),
    [
      data,
      swipeWorker,
      swipeJob,
      swipeBuilder,
      applyToJob,
      acceptApplicant,
      declineApplicant,
      postJob,
      sendMessage,
      rateUser,
      markJobComplete,
      toggleSavedJob,
      isJobSaved,
      markMatchRead,
      unreadCount,
      totalUnread,
      undoLastSwipe,
      canUndo,
      boostJob,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { SEED_BUILDERS, SEED_JOBS, SEED_WORKERS } from "@/constants/seed";
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
  typingMatches: string[];
  undoLastSwipe: () => { undoneId: string } | null;
  canUndo: boolean;
  boostJob: (jobId: string) => void;
};

const DataContext = createContext<DataContextValue | null>(null);
const STORAGE_KEY = "buildmatch.data.v1";

function newId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const seed: Persisted = {
  workers: SEED_WORKERS,
  builders: SEED_BUILDERS,
  jobs: SEED_JOBS,
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
  const { user } = useAuth();
  const [data, setData] = useState<Persisted>(seed);
  const [typingMatches, setTypingMatches] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Persisted;
          setData({
            workers: parsed.workers?.length ? parsed.workers : SEED_WORKERS,
            builders: parsed.builders?.length ? parsed.builders : SEED_BUILDERS,
            jobs: parsed.jobs ?? [],
            swipes: parsed.swipes ?? [],
            matches: parsed.matches ?? [],
            messages: parsed.messages ?? [],
            ratings: parsed.ratings ?? [],
            completedSnaps: parsed.completedSnaps ?? [],
            savedJobs: parsed.savedJobs ?? [],
            lastReadAt: parsed.lastReadAt ?? {},
            boostedJobs: parsed.boostedJobs ?? [],
          });
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, hydrated]);

  const meId = user?.id ?? "anon";

  const swipeWorker = useCallback<DataContextValue["swipeWorker"]>(
    (workerId, direction) => {
      let matched = false;
      let matchId: string | undefined;
      setData((prev) => {
        const swipe: Swipe = { fromId: meId, toId: workerId, direction, ts: Date.now() };
        let matches = prev.matches;
        if (direction === "right") {
          // Auto-match: in MVP demo, every right-swipe on a seeded worker creates a match
          // (simulating mutual interest from seed data).
          matchId = newId("m");
          matched = true;
          matches = [
            ...matches,
            { id: matchId, builderId: meId, workerId, createdAt: Date.now() },
          ];
        }
        return { ...prev, swipes: [...prev.swipes, swipe], matches };
      });
      return { matched, matchId };
    },
    [meId],
  );

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
          // Worker right-swiping on job acts as an application
          jobs = jobs.map((j) =>
            j.id === jobId && !j.applicants.includes(meId)
              ? { ...j, applicants: [...j.applicants, meId] }
              : j,
          );
          // Auto-accept in demo for delight
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
      return { matched, matchId };
    },
    [meId],
  );

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
    },
    [meId],
  );

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
      return matchId;
    },
    [],
  );

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
    },
    [],
  );

  const postJob = useCallback<DataContextValue["postJob"]>(
    (job) => {
      const fresh: Job = {
        ...job,
        id: newId("j"),
        builderId: meId,
        createdAt: Date.now(),
        applicants: [],
      };
      setData((prev) => ({ ...prev, jobs: [fresh, ...prev.jobs] }));
    },
    [meId],
  );

  const sendMessage = useCallback<DataContextValue["sendMessage"]>(
    (matchId, text) => {
      const msg: Message = {
        id: newId("msg"),
        matchId,
        fromId: meId,
        text,
        ts: Date.now(),
      };
      setData((prev) => ({ ...prev, messages: [...prev.messages, msg] }));

      // Show typing indicator briefly, then auto-reply
      setTimeout(() => {
        setTypingMatches((prev) =>
          prev.includes(matchId) ? prev : [...prev, matchId],
        );
      }, 450);

      setTimeout(() => {
        setTypingMatches((prev) => prev.filter((id) => id !== matchId));
        setData((prev) => {
          const match = prev.matches.find((m) => m.id === matchId);
          if (!match) return prev;
          const otherId = match.builderId === meId ? match.workerId : match.builderId;
          const replies = [
            "Sounds good. When can you start?",
            "Cheers — I'll send through the address shortly.",
            "Yep, I've got the tickets you need.",
            "On site by 7? I'll bring my own tools.",
            "All good. Let me confirm with the crew.",
          ];
          const reply: Message = {
            id: newId("msg"),
            matchId,
            fromId: otherId,
            text: replies[Math.floor(Math.random() * replies.length)] ?? "Sounds good.",
            ts: Date.now(),
          };
          return { ...prev, messages: [...prev.messages, reply] };
        });
      }, 1900);
    },
    [meId],
  );

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

  const markJobComplete = useCallback<DataContextValue["markJobComplete"]>(
    (jobId) => {
      setData((prev) => {
        const job = prev.jobs.find((j) => j.id === jobId);
        const match = prev.matches.find((m) => m.jobId === jobId);
        const snaps = job && match
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

  const undoLastSwipe = useCallback<DataContextValue["undoLastSwipe"]>(() => {
    let undone: { undoneId: string } | null = null;
    setData((prev) => {
      // Find last swipe by me
      let idx = -1;
      for (let i = prev.swipes.length - 1; i >= 0; i--) {
        if (prev.swipes[i].fromId === meId) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return prev;
      const last = prev.swipes[idx];
      undone = { undoneId: last.toId };
      const swipes = [...prev.swipes.slice(0, idx), ...prev.swipes.slice(idx + 1)];
      // Remove any match created from this right-swipe
      let matches = prev.matches;
      let jobs = prev.jobs;
      let messages = prev.messages;
      if (last.direction === "right") {
        const isJob = prev.jobs.some((j) => j.id === last.toId);
        if (isJob) {
          matches = matches.filter(
            (m) => !(m.jobId === last.toId && m.workerId === meId),
          );
          jobs = jobs.map((j) =>
            j.id === last.toId
              ? { ...j, applicants: j.applicants.filter((a) => a !== meId) }
              : j,
          );
        } else {
          matches = matches.filter(
            (m) => !(m.workerId === last.toId && m.builderId === meId && !m.jobId),
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
    return undone;
  }, [meId]);

  const canUndo = useMemo(
    () => data.swipes.some((s) => s.fromId === meId),
    [data.swipes, meId],
  );

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

  const value = useMemo<DataContextValue>(
    () => ({
      ...data,
      swipeWorker,
      swipeJob,
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
      typingMatches,
      undoLastSwipe,
      canUndo,
      boostJob,
    }),
    [
      data,
      typingMatches,
      swipeWorker,
      swipeJob,
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

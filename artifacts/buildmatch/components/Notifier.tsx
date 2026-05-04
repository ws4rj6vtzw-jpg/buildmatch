import { usePathname } from "expo-router";
import React, { useEffect, useRef } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useNotify } from "@/contexts/NotificationContext";

export function Notifier() {
  const { user } = useAuth();
  const { matches, messages, workers, builders, jobs } = useData();
  const notify = useNotify();
  const pathname = usePathname();
  const seededRef = useRef(false);
  const lastMatchCount = useRef(0);
  const lastMessageId = useRef<string | null>(null);
  const meId = user?.id;

  // Seed initial counts on first mount per user (avoid notifying for existing data)
  useEffect(() => {
    if (!meId) return;
    seededRef.current = false;
    lastMatchCount.current = matches.length;
    lastMessageId.current = messages[messages.length - 1]?.id ?? null;
    seededRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meId]);

  // New matches
  useEffect(() => {
    if (!seededRef.current || !meId) return;
    if (matches.length > lastMatchCount.current) {
      const fresh = matches.slice(lastMatchCount.current);
      for (const m of fresh) {
        const otherIsWorker = m.builderId === meId;
        const otherId = otherIsWorker ? m.workerId : m.builderId;
        const other = otherIsWorker
          ? workers.find((w) => w.id === otherId)
          : builders.find((b) => b.id === otherId);
        const job = m.jobId ? jobs.find((j) => j.id === m.jobId) : undefined;
        // Suppress if currently in chat for this match
        if (pathname?.includes(`/chat/${m.id}`)) continue;
        notify({
          title: "✓ Connected!",
          body: job
            ? `${other?.name ?? "Someone"} on ${job.title}`
            : `${other?.name ?? "Someone"} wants to connect`,
          icon: "zap",
          tone: "primary",
          photo: other?.photo,
          initials: other?.name,
          href: `/chat/${m.id}`,
        });
      }
    }
    lastMatchCount.current = matches.length;
  }, [matches, meId, workers, builders, jobs, notify, pathname]);

  // New messages from other party
  useEffect(() => {
    if (!seededRef.current || !meId) return;
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.id === lastMessageId.current) return;
    lastMessageId.current = last.id;
    if (last.fromId === meId) return;
    // Suppress if user is currently viewing that chat
    if (pathname?.includes(`/chat/${last.matchId}`)) return;
    const match = matches.find((m) => m.id === last.matchId);
    if (!match) return;
    const other = match.builderId === meId
      ? workers.find((w) => w.id === match.workerId)
      : builders.find((b) => b.id === match.builderId);
    notify({
      title: other?.name ?? "New message",
      body: last.text,
      icon: "message-circle",
      photo: other?.photo,
      initials: other?.name,
      href: `/chat/${last.matchId}`,
    });
  }, [messages, matches, meId, workers, builders, notify, pathname]);

  return null;
}

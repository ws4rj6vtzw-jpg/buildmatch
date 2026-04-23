import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { SwipeCard, type SwipeCardData } from "@/components/SwipeCard";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

export default function DiscoverScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const { workers, builders, jobs, swipes, swipeWorker, swipeJob } = useData();
  const [matchModal, setMatchModal] = useState<{ matchId: string; title: string } | null>(null);

  const isWorker = user?.role === "worker";

  const deck: SwipeCardData[] = useMemo(() => {
    const swipedIds = new Set(swipes.map((s) => s.toId));

    if (isWorker) {
      // Workers see jobs (and builder profiles when no jobs)
      const jobCards: SwipeCardData[] = jobs
        .filter((j) => !swipedIds.has(j.id))
        .map((j) => {
          const builder = builders.find((b) => b.id === j.builderId);
          return {
            id: j.id,
            title: j.title,
            subtitle: `${j.trade}  ·  ${builder?.name ?? "Builder"}`,
            meta: `${j.suburb}  ·  ${j.startDate}  ·  $${j.payRate}/${j.payType === "hour" ? "hr" : "day"}`,
            photo: builder?.photo,
            badges: [
              { label: j.trade, tone: "primary" },
              ...(j.requiredTickets.slice(0, 2).map((t) => ({ label: t }))),
            ],
            rating: builder?.rating,
            jobCount: builder?.completedJobs,
            description: j.description,
          };
        });
      return jobCards;
    }

    return workers
      .filter((w) => !swipedIds.has(w.id))
      .map((w) => ({
        id: w.id,
        title: w.name,
        subtitle: `${w.primaryTrade}  ·  ${w.yearsExperience} yrs experience`,
        meta: `${w.suburb}  ·  ${w.distanceKm}km away`,
        photo: w.photo,
        badges: [
          {
            label: w.availableNow ? "Available now" : `Avail. ${w.availableFrom ?? "soon"}`,
            tone: w.availableNow ? "primary" : "default",
          },
          ...w.skills.slice(0, 2).map((s) => ({ label: s })),
        ],
        rating: w.rating,
        jobCount: w.completedJobs,
        description: w.bio,
      }));
  }, [isWorker, jobs, workers, builders, swipes]);

  const handleSwipe = (id: string, dir: "left" | "right") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(
        dir === "right"
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => undefined);
    }
    const result = isWorker ? swipeJob(id, dir) : swipeWorker(id, dir);
    if (result.matched && result.matchId) {
      const card = deck.find((d) => d.id === id);
      setMatchModal({ matchId: result.matchId, title: card?.title ?? "Match" });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
          () => undefined,
        );
      }
    }
  };

  const top = deck[0];
  const next = deck[1];
  const third = deck[2];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={isWorker ? "Jobs near you" : "Discover workers"}
        subtitle={isWorker ? "Swipe right to apply" : "Swipe right to connect"}
      />

      <View style={styles.deckWrap}>
        {deck.length === 0 && (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Feather name="check" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              You're all caught up
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {isWorker
                ? "New jobs land here every day. Check the Jobs tab to browse."
                : "New workers join daily. Check back soon or post a job."}
            </Text>
          </View>
        )}

        {third && <SwipeCard key={third.id} data={third} isTop={false} onSwipe={() => undefined} stackOffset={2} />}
        {next && <SwipeCard key={next.id} data={next} isTop={false} onSwipe={() => undefined} stackOffset={1} />}
        {top && (
          <SwipeCard
            key={top.id}
            data={top}
            isTop
            stackOffset={0}
            onSwipe={(d) => handleSwipe(top.id, d)}
          />
        )}
      </View>

      {top && (
        <View style={styles.actions}>
          <ActionBtn
            icon="x"
            color={colors.mutedForeground}
            bg={colors.card}
            onPress={() => handleSwipe(top.id, "left")}
          />
          <ActionBtn
            icon="zap"
            color={colors.accent}
            bg={colors.card}
            onPress={() => handleSwipe(top.id, "right")}
            small
          />
          <ActionBtn
            icon="check"
            color={colors.primaryForeground}
            bg={colors.primary}
            onPress={() => handleSwipe(top.id, "right")}
            big
          />
        </View>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={!!matchModal}
        onRequestClose={() => setMatchModal(null)}
      >
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={[styles.modalIcon, { backgroundColor: colors.primary }]}>
              <Feather name="zap" size={36} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              It's a match
            </Text>
            <Text style={[styles.modalText, { color: colors.mutedForeground }]}>
              {matchModal?.title}
            </Text>
            <Pressable
              onPress={() => {
                const id = matchModal?.matchId;
                setMatchModal(null);
                if (id) router.push(`/chat/${id}`);
              }}
              style={({ pressed }) => [
                styles.modalBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={[styles.modalBtnText, { color: colors.primaryForeground }]}>
                Send a message
              </Text>
            </Pressable>
            <Pressable onPress={() => setMatchModal(null)} style={{ marginTop: 12 }}>
              <Text style={[styles.modalLink, { color: colors.mutedForeground }]}>
                Keep swiping
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ActionBtn({
  icon,
  color,
  bg,
  onPress,
  big,
  small,
}: {
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
  onPress: () => void;
  big?: boolean;
  small?: boolean;
}) {
  const size = big ? 68 : small ? 50 : 60;
  const iconSize = big ? 30 : small ? 22 : 26;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.8 : 1,
          shadowColor: "#000",
          shadowOpacity: 0.4,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 12,
        },
      ]}
    >
      <Feather name={icon} size={iconSize} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  deckWrap: {
    flex: 1,
    margin: 18,
    marginTop: 6,
    marginBottom: 0,
    position: "relative",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
    paddingVertical: 20,
    paddingBottom: Platform.OS === "web" ? 100 : 24,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  modalIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 22,
  },
  modalBtn: {
    alignSelf: "stretch",
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  modalLink: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});

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

const RADIUS_OPTIONS = [5, 15, 30, 50, 100, 0] as const; // 0 = any
const DEFAULT_RADIUS = 25;

function jobDistanceKm(jobId: string) {
  // Deterministic pseudo-distance derived from job id (1..80km)
  let h = 0;
  for (let i = 0; i < jobId.length; i++) h = (h * 31 + jobId.charCodeAt(i)) | 0;
  return Math.abs(h % 80) + 1;
}

export default function DiscoverScreen() {
  const colors = useColors();
  const { user, updateProfile } = useAuth();
  const { workers, builders, jobs, swipes, swipeWorker, swipeJob, undoLastSwipe, canUndo } = useData();
  const [matchModal, setMatchModal] = useState<{ matchId: string; title: string } | null>(null);
  const [radiusOpen, setRadiusOpen] = useState(false);

  const isWorker = user?.role === "worker";
  const radius = user?.travelRadiusKm ?? DEFAULT_RADIUS;
  const radiusLabel = radius === 0 ? "Any distance" : `${radius}km`;

  const deck: SwipeCardData[] = useMemo(() => {
    const swipedIds = new Set(swipes.map((s) => s.toId));
    const within = (km: number) => radius === 0 || km <= radius;

    if (isWorker) {
      const jobCards: SwipeCardData[] = jobs
        .filter((j) => !swipedIds.has(j.id))
        .map((j) => ({ j, km: jobDistanceKm(j.id) }))
        .filter(({ km }) => within(km))
        .map(({ j, km }) => {
          const builder = builders.find((b) => b.id === j.builderId);
          return {
            id: j.id,
            title: j.title,
            subtitle: `${j.trade}  ·  ${builder?.name ?? "Builder"}`,
            meta: `${j.suburb}  ·  ${km}km away  ·  £${j.payRate}/${j.payType === "hour" ? "hr" : "day"}`,
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
      .filter((w) => within(w.distanceKm))
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
          ...(w.publicLiabilityInsured ? [{ label: "Insured", tone: "accent" as const }] : []),
          ...w.skills.slice(0, 2).map((s) => ({ label: s })),
        ],
        rating: w.rating,
        jobCount: w.completedJobs,
        description: w.bio,
      }));
  }, [isWorker, jobs, workers, builders, swipes, radius]);

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
        right={
          <Pressable
            onPress={() => setRadiusOpen(true)}
            style={({ pressed }) => [
              styles.radiusBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text style={[styles.radiusBtnText, { color: colors.foreground }]}>
              {radiusLabel}
            </Text>
          </Pressable>
        }
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
            rightLabel={isWorker ? "MATCH" : "GO"}
          />
        )}
      </View>

      {(top || canUndo) && (
        <View style={styles.actions}>
          <ActionBtn
            icon="rotate-ccw"
            color={canUndo ? colors.accent : colors.mutedForeground}
            bg={colors.card}
            disabled={!canUndo}
            onPress={() => {
              const res = undoLastSwipe();
              if (res && Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                  () => undefined,
                );
              }
            }}
            small
          />
          {top && (
            <ActionBtn
              icon="x"
              color={colors.mutedForeground}
              bg={colors.card}
              onPress={() => handleSwipe(top.id, "left")}
            />
          )}
          {top && (
            <ActionBtn
              icon="check"
              color={colors.primaryForeground}
              bg={colors.primary}
              onPress={() => handleSwipe(top.id, "right")}
              big
            />
          )}
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
              <Feather name="check" size={36} color={colors.primaryForeground} />
            </View>
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

      <Modal
        transparent
        animationType="fade"
        visible={radiusOpen}
        onRequestClose={() => setRadiusOpen(false)}
      >
        <Pressable style={styles.modalBg} onPress={() => setRadiusOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[styles.radiusCard, { backgroundColor: colors.card }]}
          >
            <View style={[styles.modalIcon, { backgroundColor: colors.primary, marginBottom: 8 }]}>
              <Feather name="map-pin" size={28} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Search radius
            </Text>
            <Text style={[styles.modalText, { color: colors.mutedForeground }]}>
              Only show {isWorker ? "jobs" : "workers"} within this distance.
            </Text>
            <View style={styles.radiusGrid}>
              {RADIUS_OPTIONS.map((km) => {
                const selected = radius === km;
                const label = km === 0 ? "Any" : `${km}km`;
                return (
                  <Pressable
                    key={km}
                    onPress={() => updateProfile({ travelRadiusKm: km })}
                    style={({ pressed }) => [
                      styles.radiusOpt,
                      {
                        backgroundColor: selected ? colors.primary : colors.elevated,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.radiusOptText,
                        {
                          color: selected ? colors.primaryForeground : colors.foreground,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              onPress={() => setRadiusOpen(false)}
              style={({ pressed }) => [
                styles.modalBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, marginTop: 18 },
              ]}
            >
              <Text style={[styles.modalBtnText, { color: colors.primaryForeground }]}>
                Done
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
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
  disabled,
}: {
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
  onPress: () => void;
  big?: boolean;
  small?: boolean;
  disabled?: boolean;
}) {
  const size = big ? 68 : small ? 50 : 60;
  const iconSize = big ? 30 : small ? 22 : 26;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
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
  radiusBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  radiusBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  radiusCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    padding: 26,
    alignItems: "center",
  },
  radiusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 18,
    alignSelf: "stretch",
  },
  radiusOpt: {
    flexBasis: "30%",
    flexGrow: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  radiusOptText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
});

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PaywallModal } from "@/components/PaywallModal";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SwipeCard, type SwipeCardData } from "@/components/SwipeCard";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useSubscription } from "@/lib/revenuecat";

const DEFAULT_RADIUS = 25;
const FREE_LIMIT = 5;

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function jobDistanceMiles(id: string) {
  return (hashId(id) % 80) + 1;
}

function builderDistanceMiles(id: string) {
  return (hashId(id) % 60) + 2;
}

type WorkerView = "jobs" | "employers";

type MatchModalState = {
  matchId: string;
  title: string;
  kind: "job" | "employer";
};

export default function DiscoverScreen() {
  const colors = useColors();
  const { user, updateProfile } = useAuth();
  const {
    workers, builders, jobs, swipes, matches, boostedJobs,
    swipeWorker, swipeJob, swipeBuilder, undoLastSwipe, canUndo,
  } = useData();

  const [matchModal, setMatchModal] = useState<MatchModalState | null>(null);
  const [radiusOpen, setRadiusOpen] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [pendingSwipe, setPendingSwipe] = useState<{ id: string } | null>(null);
  const [workerView, setWorkerView] = useState<WorkerView>("jobs");

  const { purchaseBuilderPro } = useSubscription();

  const isWorker = user?.role === "worker";
  const radius = user?.travelRadiusMiles ?? DEFAULT_RADIUS;
  const radiusLabel = `${radius} mi`;
  const [radiusDraft, setRadiusDraft] = useState(radius);

  const builderMatchCount = useMemo(
    () => matches.filter((m) => m.builderId === user?.id).length,
    [matches, user?.id],
  );
  const freeLeft = Math.max(0, FREE_LIMIT - builderMatchCount);
  const isPro = !!user?.isPro;

  // Jobs deck — workers swiping on jobs
  const jobsDeck: SwipeCardData[] = useMemo(() => {
    if (!isWorker) return [];
    const swipedIds = new Set(swipes.map((s) => s.toId));
    const within = (km: number) => radius === 0 || km <= radius;
    const cards: SwipeCardData[] = jobs
      .filter((j) => !swipedIds.has(j.id))
      .map((j) => ({ j, km: jobDistanceKm(j.id) }))
      .filter(({ km }) => within(km))
      .map(({ j, km }) => {
        const builder = builders.find((b) => b.id === j.builderId);
        const boosted = boostedJobs.includes(j.id);
        return {
          id: j.id,
          title: j.title,
          subtitle: `${j.trade}  ·  ${builder?.name ?? "Builder"}`,
          meta: `${j.suburb}  ·  ${km}km away  ·  £${j.payRate}/${j.payType === "hour" ? "hr" : "day"}`,
          photo: builder?.photo,
          badges: [
            ...(boosted ? [{ label: "Sponsored", tone: "accent" as const }] : []),
            { label: j.trade, tone: "primary" as const },
            ...(j.requiredTickets.slice(0, 1).map((t) => ({ label: t }))),
          ],
          rating: builder?.rating,
          jobCount: builder?.completedJobs,
          description: j.description,
        };
      });
    const boostedSet = new Set(boostedJobs);
    return cards.sort((a, b) => (boostedSet.has(b.id) ? 1 : 0) - (boostedSet.has(a.id) ? 1 : 0));
  }, [isWorker, jobs, builders, swipes, radius, boostedJobs]);

  // Employers deck — workers swiping on builder company profiles
  const employersDeck: SwipeCardData[] = useMemo(() => {
    if (!isWorker) return [];
    const swipedIds = new Set(swipes.map((s) => s.toId));
    const within = (km: number) => radius === 0 || km <= radius;
    return builders
      .filter((b) => !swipedIds.has(b.id))
      .map((b) => ({ b, km: builderDistanceKm(b.id) }))
      .filter(({ km }) => within(km))
      .map(({ b, km }) => ({
        id: b.id,
        title: b.name,
        subtitle: `Contact: ${b.contactName}  ·  ${b.suburb}`,
        meta: `${b.suburb}  ·  ${km}km away`,
        photo: b.photo,
        badges: b.tradesNeeded.slice(0, 3).map((t) => ({ label: t, tone: "primary" as const })),
        rating: b.rating,
        jobCount: b.completedJobs,
        description: b.bio,
      }));
  }, [isWorker, builders, swipes, radius]);

  // Builders swiping on workers deck
  const workersDeck: SwipeCardData[] = useMemo(() => {
    if (isWorker) return [];
    const swipedIds = new Set(swipes.map((s) => s.toId));
    const within = (km: number) => radius === 0 || km <= radius;
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
  }, [isWorker, workers, swipes, radius]);

  // The active deck based on role + workerView toggle
  const deck = isWorker
    ? workerView === "employers" ? employersDeck : jobsDeck
    : workersDeck;

  const completeSwipe = (id: string) => {
    let result: { matched: boolean; matchId?: string };
    let kind: "job" | "employer" = "job";

    if (!isWorker) {
      result = swipeWorker(id, "right");
    } else if (workerView === "employers") {
      result = swipeBuilder(id, "right");
      kind = "employer";
    } else {
      result = swipeJob(id, "right");
    }

    if (result.matched && result.matchId) {
      const card = deck.find((d) => d.id === id);
      setMatchModal({ matchId: result.matchId, title: card?.title ?? "Match", kind });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      }
    }
  };

  const handleSwipe = (id: string, dir: "left" | "right") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(
        dir === "right" ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => undefined);
    }

    if (!isWorker && dir === "right" && !isPro && builderMatchCount >= FREE_LIMIT) {
      setPendingSwipe({ id });
      setPaywallVisible(true);
      return;
    }

    if (dir === "right") {
      completeSwipe(id);
    } else {
      if (!isWorker) {
        swipeWorker(id, "left");
      } else if (workerView === "employers") {
        swipeBuilder(id, "left");
      } else {
        swipeJob(id, "left");
      }
    }
  };

  const handleGoPro = async () => {
    setPaywallVisible(false);
    await purchaseBuilderPro();
    if (pendingSwipe) {
      completeSwipe(pendingSwipe.id);
      setPendingSwipe(null);
    }
  };

  const headerTitle = isWorker
    ? workerView === "employers" ? "Employers near you" : "Jobs near you"
    : "Discover workers";

  const headerSubtitle = isWorker
    ? workerView === "employers" ? "Swipe right to connect with employers" : "Swipe right to apply"
    : "Swipe right to connect";

  const rightLabel = isWorker
    ? workerView === "employers" ? "CONNECT" : "APPLY"
    : "GO";

  const top = deck[0];
  const next = deck[1];
  const third = deck[2];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        right={
          <Pressable
            onPress={() => setRadiusOpen(true)}
            style={({ pressed }) => [
              styles.radiusBtn,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text style={[styles.radiusBtnText, { color: colors.foreground }]}>{radiusLabel}</Text>
          </Pressable>
        }
      />

      {/* Worker view toggle — Jobs vs Employers */}
      {isWorker && (
        <View style={[styles.segmentWrap, { backgroundColor: colors.elevated, borderBottomColor: colors.border }]}>
          <View style={[styles.segmentTrack, { backgroundColor: colors.card }]}>
            <Pressable
              onPress={() => setWorkerView("jobs")}
              style={[
                styles.segmentBtn,
                workerView === "jobs" && { backgroundColor: colors.primary },
              ]}
            >
              <Feather
                name="briefcase"
                size={13}
                color={workerView === "jobs" ? colors.primaryForeground : colors.mutedForeground}
              />
              <Text style={[
                styles.segmentLabel,
                { color: workerView === "jobs" ? colors.primaryForeground : colors.mutedForeground },
              ]}>
                Jobs
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setWorkerView("employers")}
              style={[
                styles.segmentBtn,
                workerView === "employers" && { backgroundColor: colors.primary },
              ]}
            >
              <Feather
                name="home"
                size={13}
                color={workerView === "employers" ? colors.primaryForeground : colors.mutedForeground}
              />
              <Text style={[
                styles.segmentLabel,
                { color: workerView === "employers" ? colors.primaryForeground : colors.mutedForeground },
              ]}>
                Employers
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Free match counter — builders only */}
      {!isWorker && !isPro && (
        <View style={[styles.freeBar, { backgroundColor: colors.elevated, borderBottomColor: colors.border }]}>
          <View style={styles.freeDots}>
            {Array.from({ length: FREE_LIMIT }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.freeDot,
                  {
                    backgroundColor: i < builderMatchCount
                      ? freeLeft <= 1 ? "#F59E0B" : colors.primary
                      : colors.border,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.freeText, { color: freeLeft <= 1 ? "#F59E0B" : colors.mutedForeground }]}>
            {freeLeft === 0
              ? "Free matches used — upgrade to hire more"
              : `${freeLeft} free match${freeLeft === 1 ? "" : "es"} remaining`}
          </Text>
          <Pressable onPress={() => { setPendingSwipe(null); setPaywallVisible(true); }} hitSlop={8}>
            <Text style={[styles.upgradeLink, { color: colors.primary }]}>Upgrade</Text>
          </Pressable>
        </View>
      )}

      {!isWorker && isPro && (
        <View style={[styles.freeBar, { backgroundColor: colors.elevated, borderBottomColor: colors.border }]}>
          <Feather name="zap" size={13} color={colors.accent} />
          <Text style={[styles.freeText, { color: colors.accent }]}>Pro · Unlimited matches active</Text>
        </View>
      )}

      <View style={styles.deckWrap}>
        {deck.length === 0 && (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Feather name="check" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>You're all caught up</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {isWorker
                ? workerView === "employers"
                  ? "No more employers in your area right now. Check back soon."
                  : "New jobs land here every day. Check the Jobs tab to browse."
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
            rightLabel={rightLabel}
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
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
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

      {/* Match modal */}
      <Modal transparent animationType="fade" visible={!!matchModal} onRequestClose={() => setMatchModal(null)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={[styles.modalIcon, { backgroundColor: colors.primary }]}>
              <Feather name="check" size={36} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              {matchModal?.kind === "employer" ? "Connected!" : "It's a match!"}
            </Text>
            <Text style={[styles.modalText, { color: colors.mutedForeground }]}>
              {matchModal?.kind === "employer"
                ? `You've connected with ${matchModal?.title}. Drop them a message to introduce yourself.`
                : `${matchModal?.title} is expecting to hear from you.`}
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
              <Text style={[styles.modalBtnText, { color: colors.primaryForeground }]}>Send a message</Text>
            </Pressable>
            <Pressable onPress={() => setMatchModal(null)} style={{ marginTop: 12 }}>
              <Text style={[styles.modalLink, { color: colors.mutedForeground }]}>Keep swiping</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Radius modal */}
      <Modal transparent animationType="fade" visible={radiusOpen} onRequestClose={() => setRadiusOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setRadiusOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[styles.radiusCard, { backgroundColor: colors.card }]}
          >
            <View style={[styles.modalIcon, { backgroundColor: colors.primary, marginBottom: 8 }]}>
              <Feather name="map-pin" size={28} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Search radius</Text>
            <Text style={[styles.modalText, { color: colors.mutedForeground }]}>
              Only show {isWorker ? (workerView === "employers" ? "employers" : "jobs") : "workers"} within this distance.
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
                      { backgroundColor: selected ? colors.primary : colors.elevated, opacity: pressed ? 0.85 : 1 },
                    ]}
                  >
                    <Text style={[styles.radiusOptText, { color: selected ? colors.primaryForeground : colors.foreground }]}>
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
              <Text style={[styles.modalBtnText, { color: colors.primaryForeground }]}>Done</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Paywall modal */}
      <PaywallModal
        visible={paywallVisible}
        usedCount={builderMatchCount}
        onGoPro={handleGoPro}
        onClose={() => { setPaywallVisible(false); setPendingSwipe(null); }}
      />
    </View>
  );
}

function ActionBtn({
  icon, color, bg, onPress, big, small, disabled,
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
  segmentWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  segmentTrack: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  segmentLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  freeBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  freeDots: {
    flexDirection: "row",
    gap: 5,
  },
  freeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  freeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  upgradeLink: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_700Bold",
  },
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
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.4,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
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
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
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
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  modalLink: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
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
    fontFamily: "PlusJakartaSans_600SemiBold",
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
    fontFamily: "PlusJakartaSans_700Bold",
  },
});

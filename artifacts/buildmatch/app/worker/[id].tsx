import { Feather } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { PaywallModal } from "@/components/PaywallModal";
import { Pill } from "@/components/Pill";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useSubscription } from "@/lib/revenuecat";

export default function WorkerProfile() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string; jobId?: string; matchId?: string }>();
  const params = useLocalSearchParams<{ jobId?: string; matchId?: string }>();
  const { user } = useAuth();
  const { workers, jobs, matches, ratings, acceptApplicant, declineApplicant } = useData();
  const { isPro, purchaseBuilderBasic, purchaseBuilderPro } = useSubscription();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const worker = workers.find((w) => w.id === id);
  const job = params.jobId ? jobs.find((j) => j.id === params.jobId) : undefined;
  const isOwnerBuilder =
    !!job && job.builderId === user?.id && job.applicants.includes(id ?? "");

  const matchId = params.matchId;
  const reviewMatch = matchId
    ? matches.find((m) => m.id === matchId)
    : matches.find(
        (m) =>
          m.workerId === id &&
          (m.builderId === user?.id || user?.role === "builder"),
      );
  const alreadyRated =
    !!reviewMatch &&
    ratings.some(
      (r) =>
        r.fromId === user?.id && r.jobId === (reviewMatch.jobId ?? ""),
    );
  const canLeaveReview =
    !!reviewMatch && !alreadyRated && user?.role === "builder";

  const isBuilder = user?.role === "builder";
  const isLockedBuilder = isBuilder && !isPro;

  const matchCount = matches.filter((m) => m.builderId === user?.id).length;

  if (!worker) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Stack.Screen options={{ headerTitle: "Worker" }} />
        <Text style={{ color: colors.foreground }}>Worker not found</Text>
      </View>
    );
  }

  const onAccept = () => {
    if (!job) return;
    const matchId = acceptApplicant(job.id, worker.id);
    router.replace(`/chat/${matchId}`);
  };

  const onDecline = () => {
    if (!job) return;
    declineApplicant(job.id, worker.id);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Worker profile",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerLeft: () => (
            <Pressable
              onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/matches")}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingRight: 12, paddingVertical: 4 })}
              hitSlop={8}
            >
              <Feather name="chevron-left" size={26} color={colors.primary} />
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Avatar uri={worker.photo} name={worker.name} size={92} />
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={[styles.name, { color: colors.foreground }]}>{worker.name}</Text>
            <Text style={[styles.trade, { color: colors.primary }]}>{worker.primaryTrade}</Text>
            <Text style={[styles.location, { color: colors.mutedForeground }]}>
              {worker.suburb}{worker.postcode ? `, ${worker.postcode}` : ""}  ·  {worker.distanceMiles} miles away
            </Text>
          </View>

          <View style={styles.stats}>
            <Stat label="Rating" value={worker.rating.toFixed(1)} icon="star" colors={colors} />
            <Stat label="Jobs" value={String(worker.completedJobs)} icon="check-circle" colors={colors} />
            <Stat label="Years" value={String(worker.yearsExperience)} icon="award" colors={colors} />
            {isLockedBuilder ? (
              <Pressable onPress={() => setPaywallVisible(true)} style={styles.stat}>
                <Feather name="lock" size={14} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.mutedForeground }]}>Pro</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Rate</Text>
              </Pressable>
            ) : (
              <Stat label="Rate" value={`£${worker.hourlyRate}/hr`} icon="tag" colors={colors} />
            )}
          </View>

          <View
            style={[
              styles.availChip,
              {
                backgroundColor: worker.availableNow ? colors.success : colors.elevated,
              },
            ]}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: worker.availableNow ? "#fff" : colors.mutedForeground },
              ]}
            />
            <Text
              style={[
                styles.availText,
                { color: worker.availableNow ? "#fff" : colors.mutedForeground },
              ]}
            >
              {worker.availableNow
                ? "Available now"
                : worker.availableFrom
                ? `Available from ${worker.availableFrom}`
                : "Limited availability"}
            </Text>
          </View>
        </View>

        {worker.bio ? (
          <Section label="About" colors={colors}>
            {isLockedBuilder ? (
              <LockedContent
                colors={colors}
                onUnlock={() => setPaywallVisible(true)}
              >
                <Text style={[styles.body, { color: colors.foreground }]}>{worker.bio}</Text>
              </LockedContent>
            ) : (
              <Text style={[styles.body, { color: colors.foreground }]}>{worker.bio}</Text>
            )}
          </Section>
        ) : null}

        {worker.skills.length > 0 && (
          <Section label="Skills" colors={colors}>
            <View style={styles.pills}>
              {worker.skills.map((s) => (
                <Pill key={s} label={s} />
              ))}
            </View>
          </Section>
        )}

        {worker.tickets.length > 0 && (
          <Section label="Tickets & licences" colors={colors}>
            {isLockedBuilder ? (
              <LockedContent
                colors={colors}
                onUnlock={() => setPaywallVisible(true)}
              >
                <View style={styles.pills}>
                  {worker.tickets.map((t) => (
                    <Pill key={t} label={t} />
                  ))}
                </View>
              </LockedContent>
            ) : (
              <View style={styles.pills}>
                {worker.tickets.map((t) => (
                  <Pill key={t} label={t} />
                ))}
              </View>
            )}
          </Section>
        )}

        {isLockedBuilder && (
          <Pressable
            onPress={() => setPaywallVisible(true)}
            style={({ pressed }) => [
              styles.unlockCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={[styles.unlockIcon, { backgroundColor: colors.primary + "20" }]}>
              <Feather name="lock" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.unlockTitle, { color: colors.foreground }]}>
                Upgrade to view full profile
              </Text>
              <Text style={[styles.unlockSub, { color: colors.mutedForeground }]}>
                See hourly rate, bio & verified tickets with BuildMatch Pro
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.primary} />
          </Pressable>
        )}

        {canLeaveReview && reviewMatch ? (
          <Section label="Review" colors={colors}>
            <Pressable
              onPress={() => router.push(`/review/${reviewMatch.id}`)}
              style={({ pressed }) => [
                styles.reviewBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="star" size={16} color={colors.primaryForeground} />
              <Text style={[styles.reviewBtnText, { color: colors.primaryForeground }]}>
                Leave a Review
              </Text>
            </Pressable>
          </Section>
        ) : !!reviewMatch && alreadyRated ? (
          <Section label="Review" colors={colors}>
            <View style={[styles.reviewedBadge, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
              <Feather name="check-circle" size={15} color={colors.success} />
              <Text style={[styles.reviewedText, { color: colors.mutedForeground }]}>
                You've already reviewed this worker
              </Text>
            </View>
          </Section>
        ) : null}

        {isOwnerBuilder && job ? (
          <Section label={`Application for "${job.title}"`} colors={colors}>
            <View style={styles.actionRow}>
              <Pressable
                onPress={onDecline}
                style={({ pressed }) => [
                  styles.action,
                  { backgroundColor: colors.secondary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Feather name="x" size={18} color={colors.foreground} />
                <Text style={[styles.actionText, { color: colors.foreground }]}>Decline</Text>
              </Pressable>
              <Pressable
                onPress={onAccept}
                style={({ pressed }) => [
                  styles.action,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Feather name="check" size={18} color={colors.primaryForeground} />
                <Text style={[styles.actionText, { color: colors.primaryForeground }]}>
                  Accept & message
                </Text>
              </Pressable>
            </View>
          </Section>
        ) : null}
      </ScrollView>

      <PaywallModal
        visible={paywallVisible}
        usedCount={matchCount}
        onGoPro={async (tier: "basic" | "pro") => {
          if (tier === "basic") {
            await purchaseBuilderBasic();
          } else {
            await purchaseBuilderPro();
          }
          setPaywallVisible(false);
        }}
        onClose={() => setPaywallVisible(false)}
      />
    </View>
  );
}

function LockedContent({
  children,
  colors,
  onUnlock,
}: {
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
  onUnlock: () => void;
}) {
  return (
    <View style={styles.lockedWrapper}>
      <View style={styles.lockedContentFade} pointerEvents="none">
        {children}
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.lockedOverlay,
          { backgroundColor: colors.background + "e0" },
        ]}
        pointerEvents="none"
      />
      <Pressable
        onPress={onUnlock}
        style={({ pressed }) => [
          styles.lockedCta,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Feather name="lock" size={14} color={colors.primary} />
        <Text style={[styles.lockedCtaText, { color: colors.primary }]}>
          Unlock with Pro
        </Text>
      </Pressable>
    </View>
  );
}

function Section({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={{ gap: 10, marginTop: 4 }}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label}</Text>
      {children}
    </View>
  );
}

function Stat({
  label,
  value,
  icon,
  colors,
}: {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.stat}>
      <Feather name={icon} size={14} color={colors.primary} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: Platform.OS === "web" ? 120 : 40,
    gap: 16,
  },
  hero: {
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    gap: 14,
  },
  name: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.5,
  },
  trade: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  location: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "stretch",
    marginTop: 4,
  },
  stat: {
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  availChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  availText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 22,
  },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  lockedWrapper: {
    minHeight: 60,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
  },
  lockedContentFade: {
    opacity: 0.12,
    padding: 4,
  },
  lockedOverlay: {
    borderRadius: 12,
  },
  lockedCta: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  lockedCtaText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.2,
  },
  unlockCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  unlockIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  unlockTitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    marginBottom: 2,
  },
  unlockSub: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 17,
  },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  reviewBtnText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  reviewedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  reviewedText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
});

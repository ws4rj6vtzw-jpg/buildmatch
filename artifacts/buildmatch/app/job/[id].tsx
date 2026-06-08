import { Feather } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Avatar } from "@/components/Avatar";
import { PaywallModal } from "@/components/PaywallModal";
import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useSubscription } from "@/lib/revenuecat";

export default function JobDetail() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { jobs, builders, workers, matches, applyToJob, acceptApplicant, declineApplicant } = useData();
  const { isPro, purchaseBuilderBasic, purchaseBuilderPro } = useSubscription();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const job = jobs.find((j) => j.id === id);
  const builder = builders.find((b) => b.id === job?.builderId);
  const isOwner = job?.builderId === user?.id;
  const isWorker = user?.role === "worker";
  const isBuilder = user?.role === "builder";
  const isLockedBuilder = isBuilder && !isPro;
  const alreadyApplied = !!job && !!user && job.applicants.includes(user.id);

  const matchCount = matches.filter((m) => m.builderId === user?.id).length;

  if (!job) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: colors.foreground }}>Job not found</Text>
      </View>
    );
  }

  const onApply = () => {
    applyToJob(job.id);
    if (Platform.OS === "web") {
      router.back();
    } else {
      Alert.alert("Application sent", "The builder will see your profile and reach out if there's a match.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Job details",
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
        <View style={[styles.tradeChip, { backgroundColor: colors.primary }]}>
          <Text style={[styles.tradeText, { color: colors.primaryForeground }]}>
            {job.trade}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>{job.title}</Text>

        <View style={styles.metaGrid}>
          <Meta icon="tag" label="Pay" value={`£${job.payRate} / ${job.payType === "hour" ? "hr" : "day"}`} />
          <Meta icon="map-pin" label="Location" value={`${job.suburb} ${job.postcode}`} />
          <Meta icon="calendar" label="Start" value={job.startDate} />
          <Meta icon="clock" label="Duration" value={`${job.durationDays} ${job.durationDays === 1 ? "day" : "days"}`} />
        </View>

        {builder && (
          <View style={[styles.builderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Avatar uri={builder.photo} name={builder.name} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.builderName, { color: colors.foreground }]}>
                {builder.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
                <Feather name="star" size={12} color={colors.primary} />
                <Text style={[styles.builderMeta, { color: colors.mutedForeground }]}>
                  {builder.rating.toFixed(1)}  ·  {builder.completedJobs} jobs posted
                </Text>
              </View>
            </View>
          </View>
        )}

        <Section label="Description">
          <Text style={[styles.body, { color: colors.foreground }]}>{job.description}</Text>
        </Section>

        {job.requiredTickets.length > 0 && (
          <Section label="Required tickets">
            <View style={styles.pills}>
              {job.requiredTickets.map((t) => (
                <Pill key={t} label={t} />
              ))}
            </View>
          </Section>
        )}

        {isOwner && (
          <Section label={`Applicants (${job.applicants.length})`}>
            {job.applicants.length === 0 ? (
              <Text style={[styles.muted, { color: colors.mutedForeground }]}>
                No applicants yet. Workers who swipe right will appear here.
              </Text>
            ) : (
              <>
                {job.applicants.map((aid) => {
                  const w = workers.find((x) => x.id === aid);
                  return (
                    <Pressable
                      key={aid}
                      onPress={() => {
                        if (isLockedBuilder) {
                          setPaywallVisible(true);
                          return;
                        }
                        router.push({
                          pathname: "/worker/[id]",
                          params: { id: aid, jobId: job.id },
                        });
                      }}
                      style={({ pressed }) => [
                        styles.applicant,
                        {
                          backgroundColor: colors.card,
                          borderColor: isLockedBuilder ? colors.primary + "55" : colors.border,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                    >
                      <Avatar uri={w?.photo} name={w?.name ?? "Worker"} size={44} />

                      {isLockedBuilder ? (
                        <LockedApplicantInfo
                          colors={colors}
                          workerName={w?.name ?? "Worker"}
                          workerTrade={w?.primaryTrade ?? "Worker"}
                          workerRating={w?.rating ?? 0}
                          workerExperience={w?.yearsExperience ?? 0}
                          onUnlock={() => setPaywallVisible(true)}
                        />
                      ) : (
                        <>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.builderName, { color: colors.foreground }]}>
                              {w?.name ?? "Worker"}
                            </Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
                              <Feather name="star" size={11} color={colors.primary} />
                              <Text style={[styles.builderMeta, { color: colors.mutedForeground }]}>
                                {(w?.rating ?? 0).toFixed(1)}  ·  {w?.primaryTrade ?? "Worker"}  ·  {w?.yearsExperience ?? 0}y
                              </Text>
                            </View>
                          </View>
                          <Pressable
                            onPress={() => declineApplicant(job.id, aid)}
                            hitSlop={6}
                            style={({ pressed }) => [
                              styles.actionSm,
                              { backgroundColor: colors.secondary, opacity: pressed ? 0.8 : 1 },
                            ]}
                          >
                            <Feather name="x" size={18} color={colors.foreground} />
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              const matchId = acceptApplicant(job.id, aid);
                              router.push(`/chat/${matchId}`);
                            }}
                            hitSlop={6}
                            style={({ pressed }) => [
                              styles.actionSm,
                              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                            ]}
                          >
                            <Feather name="check" size={18} color={colors.primaryForeground} />
                          </Pressable>
                        </>
                      )}
                    </Pressable>
                  );
                })}

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
                        Upgrade to view applicants
                      </Text>
                      <Text style={[styles.unlockSub, { color: colors.mutedForeground }]}>
                        See names, trades & ratings — then accept or decline with BuildMatch Pro
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={18} color={colors.primary} />
                  </Pressable>
                )}
              </>
            )}
          </Section>
        )}

        {isWorker && !isOwner && (
          <View style={{ marginTop: 12 }}>
            <PrimaryButton
              label={alreadyApplied ? "Application sent" : "Apply to this job"}
              onPress={onApply}
              disabled={alreadyApplied}
            />
          </View>
        )}
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

function LockedApplicantInfo({
  colors,
  workerName,
  workerTrade,
  workerRating,
  workerExperience,
  onUnlock,
}: {
  colors: ReturnType<typeof useColors>;
  workerName: string;
  workerTrade: string;
  workerRating: number;
  workerExperience: number;
  onUnlock: () => void;
}) {
  return (
    <View style={styles.lockedRow}>
      <View style={styles.lockedContentFade} pointerEvents="none">
        <Text style={[styles.builderName, { color: colors.foreground }]}>{workerName}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
          <Feather name="star" size={11} color={colors.primary} />
          <Text style={[styles.builderMeta, { color: colors.mutedForeground }]}>
            {workerRating.toFixed(1)}  ·  {workerTrade}  ·  {workerExperience}y
          </Text>
        </View>
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.lockedOverlay,
          { backgroundColor: colors.card + "e8" },
        ]}
        pointerEvents="none"
      />
      <Pressable
        onPress={onUnlock}
        style={({ pressed }) => [styles.lockedCta, { opacity: pressed ? 0.8 : 1 }]}
      >
        <Feather name="lock" size={13} color={colors.primary} />
        <Text style={[styles.lockedCtaText, { color: colors.primary }]}>Unlock with Pro</Text>
      </Pressable>
    </View>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={{ gap: 10, marginTop: 8 }}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label}</Text>
      {children}
    </View>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.metaCell, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Feather name={icon} size={16} color={colors.primary} />
      <View>
        <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.metaValue, { color: colors.foreground }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  tradeChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
  },
  tradeText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaCell: {
    flexBasis: "47%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  metaLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  builderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  builderName: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  builderMeta: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
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
  muted: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  applicant: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionSm: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedRow: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
  },
  lockedContentFade: {
    opacity: 0.12,
    paddingHorizontal: 4,
  },
  lockedOverlay: {
    borderRadius: 8,
  },
  lockedCta: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lockedCtaText: {
    fontSize: 12,
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
    marginTop: 4,
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
});

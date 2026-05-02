import { Feather } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
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
import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

export default function JobDetail() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { jobs, builders, workers, applyToJob, acceptApplicant, declineApplicant } = useData();

  const job = jobs.find((j) => j.id === id);
  const builder = builders.find((b) => b.id === job?.builderId);
  const isOwner = job?.builderId === user?.id;
  const isWorker = user?.role === "worker";
  const alreadyApplied = !!job && !!user && job.applicants.includes(user.id);

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
              job.applicants.map((aid) => {
                const w = workers.find((x) => x.id === aid);
                return (
                  <Pressable
                    key={aid}
                    onPress={() =>
                      router.push({
                        pathname: "/worker/[id]",
                        params: { id: aid, jobId: job.id },
                      })
                    }
                    style={({ pressed }) => [
                      styles.applicant,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Avatar uri={w?.photo} name={w?.name ?? "Worker"} size={44} />
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
                  </Pressable>
                );
              })
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
});

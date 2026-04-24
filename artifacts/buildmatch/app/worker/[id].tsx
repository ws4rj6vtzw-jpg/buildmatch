import { Feather } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

export default function WorkerProfile() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string; jobId?: string }>();
  const params = useLocalSearchParams<{ jobId?: string }>();
  const { user } = useAuth();
  const { workers, jobs, acceptApplicant, declineApplicant } = useData();

  const worker = workers.find((w) => w.id === id);
  const job = params.jobId ? jobs.find((j) => j.id === params.jobId) : undefined;
  const isOwnerBuilder =
    !!job && job.builderId === user?.id && job.applicants.includes(id ?? "");

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
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Avatar uri={worker.photo} name={worker.name} size={92} />
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={[styles.name, { color: colors.foreground }]}>{worker.name}</Text>
            <Text style={[styles.trade, { color: colors.primary }]}>{worker.primaryTrade}</Text>
            <Text style={[styles.location, { color: colors.mutedForeground }]}>
              {worker.suburb}{worker.postcode ? `, ${worker.postcode}` : ""}  ·  {worker.distanceKm}km away
            </Text>
          </View>

          <View style={styles.stats}>
            <Stat label="Rating" value={worker.rating.toFixed(1)} icon="star" colors={colors} />
            <Stat label="Jobs" value={String(worker.completedJobs)} icon="check-circle" colors={colors} />
            <Stat label="Years" value={String(worker.yearsExperience)} icon="award" colors={colors} />
            <Stat label="Rate" value={`£${worker.hourlyRate}/hr`} icon="pound-sign" colors={colors} />
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
            <Text style={[styles.body, { color: colors.foreground }]}>{worker.bio}</Text>
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
            <View style={styles.pills}>
              {worker.tickets.map((t) => (
                <Pill key={t} label={t} />
              ))}
            </View>
          </Section>
        )}

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
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  trade: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  location: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
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
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
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
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
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
    fontFamily: "Inter_600SemiBold",
  },
});

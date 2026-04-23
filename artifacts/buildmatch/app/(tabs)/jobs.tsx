import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { JobCard } from "@/components/JobCard";
import { Pill } from "@/components/Pill";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TRADES } from "@/constants/trades";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

export default function JobsScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const { jobs, builders } = useData();
  const isWorker = user?.role === "worker";

  const [filter, setFilter] = useState<string | null>(null);

  const myJobs = useMemo(
    () => (isWorker ? [] : jobs.filter((j) => j.builderId === user?.id)),
    [isWorker, jobs, user?.id],
  );

  const browseJobs = useMemo(() => {
    const list = isWorker ? jobs : jobs.filter((j) => j.builderId !== user?.id);
    return filter ? list.filter((j) => j.trade === filter) : list;
  }, [isWorker, jobs, filter, user?.id]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={isWorker ? "Job board" : "Your jobs"}
        subtitle={
          isWorker ? "Apply directly to posted jobs" : "Manage your posts and applicants"
        }
        right={
          !isWorker ? (
            <Pressable
              onPress={() => router.push("/post-job")}
              style={({ pressed }) => [
                styles.postBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="plus" size={20} color={colors.primaryForeground} />
            </Pressable>
          ) : null
        }
      />

      {!isWorker && myJobs.length > 0 && (
        <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 12 }}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            Your posts
          </Text>
          {myJobs.map((j) => (
            <Pressable
              key={j.id}
              onPress={() => router.push(`/job/${j.id}`)}
              style={({ pressed }) => [
                styles.myJob,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.myJobTitle, { color: colors.foreground }]} numberOfLines={1}>
                  {j.title}
                </Text>
                <Text style={[styles.myJobMeta, { color: colors.mutedForeground }]}>
                  {j.trade}  ·  {j.suburb}
                </Text>
              </View>
              <View style={[styles.applicantBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.applicantBadgeText, { color: colors.primaryForeground }]}>
                  {j.applicants.length}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
            </Pressable>
          ))}
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 12 }]}>
            Other postings
          </Text>
        </View>
      )}

      {isWorker && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          <Pill label="All" selected={!filter} onPress={() => setFilter(null)} />
          {TRADES.slice(0, 10).map((t) => (
            <Pill
              key={t}
              label={t}
              selected={filter === t}
              onPress={() => setFilter(filter === t ? null : t)}
            />
          ))}
        </ScrollView>
      )}

      <FlatList
        data={browseJobs}
        keyExtractor={(j) => j.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const builder = builders.find((b) => b.id === item.builderId);
          return (
            <JobCard
              job={item}
              builderName={builder?.name}
              onPress={() => router.push(`/job/${item.id}`)}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Feather name="briefcase" size={26} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No jobs yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {isWorker
                ? "Try removing the filter or check back later."
                : "Tap + to post your first job."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  postBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filters: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  list: {
    padding: 20,
    paddingBottom: Platform.OS === "web" ? 120 : 40,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    maxWidth: 260,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  myJob: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  myJobTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  myJobMeta: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  applicantBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  applicantBadgeText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
});

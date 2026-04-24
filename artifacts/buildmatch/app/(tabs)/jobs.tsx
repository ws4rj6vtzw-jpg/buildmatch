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
  TextInput,
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

  const { savedJobs, toggleSavedJob } = useData();
  const [filter, setFilter] = useState<string | null>(null);
  const [savedOnly, setSavedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [minPay, setMinPay] = useState<number>(0);

  const myJobs = useMemo(
    () => (isWorker ? [] : jobs.filter((j) => j.builderId === user?.id)),
    [isWorker, jobs, user?.id],
  );

  const browseJobs = useMemo(() => {
    let list = isWorker ? jobs : jobs.filter((j) => j.builderId !== user?.id);
    if (isWorker && savedOnly) {
      const set = new Set(savedJobs);
      list = list.filter((j) => set.has(j.id));
    }
    if (filter) list = list.filter((j) => j.trade === filter);
    if (isWorker && minPay > 0) {
      list = list.filter((j) => {
        const hourly = j.payType === "hour" ? j.payRate : j.payRate / 8;
        return hourly >= minPay;
      });
    }
    if (isWorker && query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      list = list.filter((j) => {
        const builder = builders.find((b) => b.id === j.builderId);
        return (
          j.title.toLowerCase().includes(q) ||
          j.trade.toLowerCase().includes(q) ||
          j.suburb.toLowerCase().includes(q) ||
          j.postcode.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.requiredTickets.some((t) => t.toLowerCase().includes(q)) ||
          (builder?.name?.toLowerCase().includes(q) ?? false)
        );
      });
    }
    return list;
  }, [isWorker, jobs, filter, user?.id, savedOnly, savedJobs, query, minPay, builders]);

  const PAY_OPTIONS: { label: string; value: number }[] = [
    { label: "Any pay", value: 0 },
    { label: "£20+/hr", value: 20 },
    { label: "£30+/hr", value: 30 },
    { label: "£40+/hr", value: 40 },
    { label: "£50+/hr", value: 50 },
  ];

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
        <>
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => setSavedOnly(false)}
              style={({ pressed }) => [
                styles.toggleBtn,
                {
                  backgroundColor: !savedOnly ? colors.primary : colors.card,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Feather
                name="briefcase"
                size={14}
                color={!savedOnly ? colors.primaryForeground : colors.foreground}
              />
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: !savedOnly ? colors.primaryForeground : colors.foreground,
                  },
                ]}
              >
                All jobs
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSavedOnly(true)}
              style={({ pressed }) => [
                styles.toggleBtn,
                {
                  backgroundColor: savedOnly ? colors.primary : colors.card,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Feather
                name="bookmark"
                size={14}
                color={savedOnly ? colors.primaryForeground : colors.foreground}
              />
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: savedOnly ? colors.primaryForeground : colors.foreground,
                  },
                ]}
              >
                Saved
                {savedJobs.length > 0 ? `  ${savedJobs.length}` : ""}
              </Text>
            </Pressable>
          </View>

          <View style={styles.searchRow}>
            <View
              style={[
                styles.searchBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="search" size={16} color={colors.mutedForeground} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search jobs, trades, tickets, areas"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.searchInput, { color: colors.foreground }]}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery("")} hitSlop={8}>
                  <Feather name="x-circle" size={16} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            <Pill label="All trades" selected={!filter} onPress={() => setFilter(null)} />
            {TRADES.slice(0, 10).map((t) => (
              <Pill
                key={t}
                label={t}
                selected={filter === t}
                onPress={() => setFilter(filter === t ? null : t)}
              />
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filters, { paddingTop: 0 }]}
          >
            {PAY_OPTIONS.map((opt) => (
              <Pill
                key={opt.value}
                label={opt.label}
                selected={minPay === opt.value}
                onPress={() => setMinPay(opt.value)}
              />
            ))}
          </ScrollView>
        </>
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
              saved={isWorker ? savedJobs.includes(item.id) : undefined}
              onToggleSave={
                isWorker ? () => toggleSavedJob(item.id) : undefined
              }
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Feather
                name={savedOnly ? "bookmark" : "briefcase"}
                size={26}
                color={colors.mutedForeground}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {savedOnly ? "Nothing saved yet" : "No jobs yet"}
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {savedOnly
                ? "Tap the bookmark icon on any job to save it for later."
                : isWorker
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
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
  filters: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  searchRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    paddingVertical: 0,
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

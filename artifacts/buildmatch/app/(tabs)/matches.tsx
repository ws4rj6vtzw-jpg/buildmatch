import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Avatar } from "@/components/Avatar";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

export default function MatchesScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const { matches, messages, workers, builders, jobs, unreadCount } = useData();
  const isWorker = user?.role === "worker";

  const items = useMemo(() => {
    return matches
      .map((m) => {
        const job = m.jobId ? jobs.find((j) => j.id === m.jobId) : undefined;
        const otherIsWorker = isWorker ? false : true;
        const partnerId = isWorker ? m.builderId : m.workerId;
        const partner = otherIsWorker
          ? workers.find((w) => w.id === partnerId)
          : builders.find((b) => b.id === partnerId);
        const lastMsg = messages
          .filter((msg) => msg.matchId === m.id)
          .slice(-1)[0];
        return {
          id: m.id,
          name: partner?.name ?? "BuildMatch user",
          photo: partner?.photo,
          subtitle: job
            ? job.title
            : isWorker
            ? `${(partner as { suburb?: string } | undefined)?.suburb ?? ""}`
            : (partner as { primaryTrade?: string } | undefined)?.primaryTrade ?? "",
          preview: lastMsg?.text ?? "Say hello — start the conversation",
          ts: lastMsg?.ts ?? m.createdAt,
          unread: unreadCount(m.id),
        };
      })
      .sort((a, b) => b.ts - a.ts);
  }, [matches, messages, workers, builders, jobs, isWorker, unreadCount]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Matches"
        subtitle={items.length > 0 ? `${items.length} active conversations` : undefined}
      />

      <FlatList
        data={items}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Feather name="message-circle" size={26} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No matches yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Swipe right on the Discover tab to start a conversation.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/chat/${item.id}`)}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Avatar uri={item.photo} name={item.name} size={52} />
            <View style={styles.rowText}>
              <View style={styles.rowTop}>
                <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.time, { color: colors.mutedForeground }]}>
                  {formatTime(item.ts)}
                </Text>
              </View>
              {item.subtitle ? (
                <Text style={[styles.subtitle, { color: colors.primary }]} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              ) : null}
              <View style={styles.previewRow}>
                <Text
                  style={[
                    styles.preview,
                    {
                      color: item.unread > 0 ? colors.foreground : colors.mutedForeground,
                      fontFamily:
                        item.unread > 0 ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.preview}
                </Text>
                {item.unread > 0 ? (
                  <View style={[styles.unreadDot, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.unreadText, { color: colors.primaryForeground }]}>
                      {item.unread > 9 ? "9+" : item.unread}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === "web" ? 120 : 40,
    flexGrow: 1,
  },
  sep: { height: 1, marginLeft: 72, opacity: 0.5 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  rowText: { flex: 1, gap: 2 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  preview: {
    flex: 1,
    fontSize: 14,
  },
  unreadDot: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  empty: {
    flex: 1,
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
});

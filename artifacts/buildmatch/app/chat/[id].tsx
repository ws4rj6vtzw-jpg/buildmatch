import { Feather } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { PaywallModal } from "@/components/PaywallModal";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useSubscription } from "@/lib/revenuecat";

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const {
    matches,
    messages,
    workers,
    builders,
    jobs,
    ratings,
    sendMessage,
    markMatchRead,
  } = useData();
  const { isPro, purchaseBuilderBasic, purchaseBuilderPro, purchaseBuilderElite } = useSubscription();
  const [draft, setDraft] = useState("");
  const [paywallVisible, setPaywallVisible] = useState(false);

  useEffect(() => {
    if (id) markMatchRead(id);
  }, [id, markMatchRead]);

  useEffect(() => {
    if (id && messages.length > 0) markMatchRead(id);
  }, [id, messages.length, markMatchRead]);

  const match = matches.find((m) => m.id === id);
  const isWorker = user?.role === "worker";
  const isBuilder = user?.role === "builder";
  const isLockedBuilder = isBuilder && !isPro;

  const partner = useMemo(() => {
    if (!match) return null;
    return isWorker
      ? builders.find((b) => b.id === match.builderId)
      : workers.find((w) => w.id === match.workerId);
  }, [match, isWorker, builders, workers]);

  const job = match?.jobId ? jobs.find((j) => j.id === match.jobId) : null;

  const thread = useMemo(
    () =>
      messages
        .filter((m) => m.matchId === id)
        .slice()
        .reverse(),
    [messages, id],
  );

  const send = () => {
    const text = draft.trim();
    if (!text || !match) return;
    sendMessage(match.id, text);
    setDraft("");
  };

  const alreadyRated =
    !!match &&
    ratings.some(
      (r) => r.fromId === user?.id && r.jobId === (match.jobId ?? ""),
    );
  const jobCompleted = !!match?.jobId && !job;

  const goToReview = () => router.push(`/review/${id}`);

  const goToWorkerProfile = () => {
    if (!match || !partner) return;
    const profilePath = isWorker ? `/job/${match.jobId}` : `/worker/${partner.id}`;
    const params = !isWorker ? `?matchId=${id}` : "";
    router.push(`${profilePath}${params}` as any);
  };

  const matchCount = matches.filter((m) => m.builderId === user?.id).length;

  if (!match) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
            headerLeft: () => (
            <Pressable
              onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/matches")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                paddingRight: 12,
                paddingVertical: 4,
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              })}
              hitSlop={8}
            >
              <Feather name="chevron-left" size={26} color={colors.primary} />
            </Pressable>
          ),
          headerTitle: () => (
            <Pressable
              onPress={goToWorkerProfile}
              style={({ pressed }) => [
                styles.headerTitle,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Avatar uri={partner?.photo} name={partner?.name} size={32} />
              <View>
                <Text
                  style={[styles.partnerName, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {partner?.name ?? "BuildMatch user"}
                </Text>
                {job && (
                  <Text
                    style={[styles.partnerJob, { color: colors.primary }]}
                    numberOfLines={1}
                  >
                    {job.title}
                  </Text>
                )}
              </View>
            </Pressable>
          ),
          headerRight: () =>
            alreadyRated ? (
              <View
                style={[
                  styles.headerBadge,
                  { backgroundColor: colors.success },
                ]}
              >
                <Feather name="star" size={13} color="#fff" />
              </View>
            ) : (
              <Pressable
                onPress={goToReview}
                style={({ pressed }) => [
                  styles.headerBtn,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Feather
                  name={jobCompleted ? "star" : "check"}
                  size={14}
                  color={colors.primaryForeground}
                />
                <Text
                  style={[
                    styles.headerBtnText,
                    { color: colors.primaryForeground },
                  ]}
                >
                  {jobCompleted ? "Rate" : "Complete"}
                </Text>
              </Pressable>
            ),
        }}
      />

      {(jobCompleted || alreadyRated) && (
        <View
          style={[
            styles.banner,
            {
              backgroundColor: colors.elevated,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Feather
            name={alreadyRated ? "star" : "check-circle"}
            size={14}
            color={colors.primary}
          />
          <Text style={[styles.bannerText, { color: colors.foreground }]}>
            {alreadyRated ? "You rated this job" : "Job marked complete"}
          </Text>
          {alreadyRated ? null : (
            <Pressable onPress={goToReview} style={styles.bannerLink}>
              <Text
                style={[styles.bannerLinkText, { color: colors.primary }]}
              >
                Leave a review →
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {isLockedBuilder && (
        <Pressable
          onPress={() => setPaywallVisible(true)}
          style={({ pressed }) => [
            styles.lockedBanner,
            {
              backgroundColor: colors.primary + "15",
              borderBottomColor: colors.primary + "40",
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Feather name="lock" size={13} color={colors.primary} />
          <Text style={[styles.lockedBannerText, { color: colors.primary }]}>
            Full profile details are locked —{" "}
            <Text style={styles.lockedBannerLink}>Upgrade to Pro</Text>
          </Text>
          <Feather name="chevron-right" size={13} color={colors.primary} />
        </Pressable>
      )}

      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {thread.length === 0 && (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Say hello
            </Text>
          </View>
        )}

        <FlatList
          data={thread}
          keyExtractor={(m) => m.id}
          inverted
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.thread}
          ListHeaderComponent={null}
          renderItem={({ item }) => {
            const mine = item.fromId === user?.id;
            return (
              <View
                style={[
                  styles.bubbleRow,
                  { justifyContent: mine ? "flex-end" : "flex-start" },
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: mine ? colors.primary : colors.card,
                      borderTopRightRadius: mine ? 4 : 18,
                      borderTopLeftRadius: mine ? 18 : 4,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      {
                        color: mine
                          ? colors.primaryForeground
                          : colors.foreground,
                      },
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Message..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground }]}
              multiline
              maxLength={500}
            />
          </View>
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: colors.primary,
                opacity: !draft.trim() ? 0.4 : pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather name="arrow-up" size={22} color={colors.primaryForeground} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <PaywallModal
        visible={paywallVisible}
        usedCount={matchCount}
        onGoPro={async (tier: "basic" | "pro" | "elite") => {
          if (tier === "basic") await purchaseBuilderBasic();
          else if (tier === "pro") await purchaseBuilderPro();
          else await purchaseBuilderElite();
          setPaywallVisible(false);
        }}
        onClose={() => setPaywallVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: { flexDirection: "row", alignItems: "center", gap: 10 },
  partnerName: { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold" },
  partnerJob: { fontSize: 11, fontFamily: "PlusJakartaSans_500Medium" },
  thread: {
    padding: 16,
    paddingBottom: 20,
    gap: 8,
    flexGrow: 1,
  },
  bubbleRow: { flexDirection: "row", marginBottom: 4 },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 21,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: { fontSize: 14, fontFamily: "PlusJakartaSans_500Medium" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: "center",
  },
  input: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
    paddingVertical: 4,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    marginRight: 12,
  },
  headerBtnText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.2,
  },
  headerBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  bannerText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
    flex: 1,
  },
  bannerLink: {
    paddingVertical: 2,
  },
  bannerLinkText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  lockedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  lockedBannerText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
    flex: 1,
  },
  lockedBannerLink: {
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
});

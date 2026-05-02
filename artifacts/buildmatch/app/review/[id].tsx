import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function ReviewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const {
    matches,
    workers,
    builders,
    jobs,
    ratings,
    rateUser,
    markJobComplete,
  } = useData();

  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const match = matches.find((m) => m.id === id);
  const isWorkerUser = user?.role === "worker";

  const partner = match
    ? isWorkerUser
      ? builders.find((b) => b.id === match.builderId)
      : workers.find((w) => w.id === match.workerId)
    : null;

  const job = match?.jobId ? jobs.find((j) => j.id === match.jobId) : null;

  const partnerId = match
    ? match.builderId === user?.id
      ? match.workerId
      : match.builderId
    : "";

  const alreadyRated =
    !!match &&
    ratings.some(
      (r) => r.fromId === user?.id && r.jobId === (match.jobId ?? ""),
    );

  const workerPartner =
    !isWorkerUser && partner ? (partner as (typeof workers)[0]) : null;

  const handleStarPress = (n: number) => {
    setStars(n);
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => undefined);
    }
  };

  const submit = () => {
    if (!match || stars === 0) return;
    const jobIdForRating = match.jobId ?? `match-${match.id}`;
    rateUser(jobIdForRating, partnerId, stars, comment.trim() || undefined);
    if (match.jobId) {
      markJobComplete(match.jobId);
    }
    setSubmitted(true);
  };

  if (!match || !partner) return null;

  const showDone = alreadyRated || submitted;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Leave a Review",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 16, 40) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Worker profile header */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Avatar uri={partner.photo} name={partner.name} size={84} />

          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {partner.name}
            </Text>

            {workerPartner ? (
              <Text style={[styles.trade, { color: colors.primary }]}>
                {workerPartner.primaryTrade}
              </Text>
            ) : null}

            {job ? (
              <View
                style={[
                  styles.jobChip,
                  { backgroundColor: colors.elevated },
                ]}
              >
                <Feather
                  name="briefcase"
                  size={12}
                  color={colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.jobChipText,
                    { color: colors.mutedForeground },
                  ]}
                  numberOfLines={1}
                >
                  {job.title}
                </Text>
              </View>
            ) : null}
          </View>

          {workerPartner ? (
            <View
              style={[
                styles.statsRow,
                {
                  borderTopColor: colors.border,
                },
              ]}
            >
              <StatPill
                icon="star"
                value={workerPartner.rating.toFixed(1)}
                label="Avg rating"
                colors={colors}
              />
              <View
                style={[styles.statDivider, { backgroundColor: colors.border }]}
              />
              <StatPill
                icon="check-circle"
                value={String(workerPartner.completedJobs)}
                label="Jobs done"
                colors={colors}
              />
              <View
                style={[styles.statDivider, { backgroundColor: colors.border }]}
              />
              <StatPill
                icon="award"
                value={`${workerPartner.yearsExperience}y`}
                label="Experience"
                colors={colors}
              />
            </View>
          ) : null}
        </View>

        {showDone ? (
          /* ---- Already rated / just submitted ---- */
          <View
            style={[
              styles.doneCard,
              { backgroundColor: colors.elevated, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.doneIconWrap,
                { backgroundColor: colors.success },
              ]}
            >
              <Feather name="check" size={28} color="#fff" />
            </View>
            <Text style={[styles.doneTitle, { color: colors.foreground }]}>
              {submitted ? "Review submitted!" : "Already reviewed"}
            </Text>
            <Text style={[styles.doneSub, { color: colors.mutedForeground }]}>
              {submitted
                ? "Your feedback helps the BuildMatch community."
                : "You've already left a review for this job."}
            </Text>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.doneBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text
                style={[styles.doneBtnText, { color: colors.primaryForeground }]}
              >
                Done
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* ---- Star rating section ---- */}
            <View
              style={[
                styles.section,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Your rating
              </Text>
              <Text
                style={[styles.sectionSub, { color: colors.mutedForeground }]}
              >
                How was working with {partner.name}?
              </Text>

              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Pressable
                    key={n}
                    onPress={() => handleStarPress(n)}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.starBtn,
                      { opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Feather
                      name="star"
                      size={44}
                      color={n <= stars ? "#F59E0B" : colors.mutedForeground}
                    />
                  </Pressable>
                ))}
              </View>

              {stars > 0 ? (
                <Text
                  style={[styles.starLabel, { color: colors.primary }]}
                >
                  {LABELS[stars]}
                </Text>
              ) : (
                <Text
                  style={[styles.starHint, { color: colors.mutedForeground }]}
                >
                  Tap a star to rate
                </Text>
              )}
            </View>

            {/* ---- Comment section ---- */}
            <View
              style={[
                styles.section,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Comments
              </Text>
              <Text
                style={[styles.sectionSub, { color: colors.mutedForeground }]}
              >
                Optional — share details to help other builders
              </Text>

              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="E.g. Arrived on time, excellent brickwork..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                maxLength={300}
                style={[
                  styles.input,
                  {
                    color: colors.foreground,
                    backgroundColor: colors.elevated,
                    borderColor: colors.border,
                  },
                ]}
              />
              <Text
                style={[styles.charCount, { color: colors.mutedForeground }]}
              >
                {comment.length} / 300
              </Text>
            </View>

            {/* ---- Actions ---- */}
            <View style={styles.actions}>
              <PrimaryButton
                label="Submit review"
                onPress={submit}
                disabled={stars === 0}
              />
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                  styles.skipBtn,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
                  Skip for now
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StatPill({
  icon,
  value,
  label,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  value: string;
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.statPill}>
      <Feather name={icon} size={13} color={colors.primary} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
  },
  profileCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  profileInfo: {
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  trade: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  jobChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    marginTop: 4,
  },
  jobChipText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  statsRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    borderTopWidth: 1,
    marginTop: 4,
    paddingTop: 16,
    justifyContent: "space-around",
  },
  statPill: {
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
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  statDivider: {
    width: 1,
    height: "80%",
    alignSelf: "center",
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 18,
  },
  starsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 14,
    alignSelf: "center",
  },
  starBtn: {
    padding: 4,
  },
  starLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    textAlign: "center",
    marginTop: 6,
  },
  starHint: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    marginTop: 6,
  },
  input: {
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlignVertical: "top",
    marginTop: 6,
  },
  charCount: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_500Medium",
    textAlign: "right",
  },
  actions: {
    gap: 0,
    marginTop: 4,
  },
  skipBtn: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 4,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  doneCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    gap: 10,
  },
  doneIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  doneTitle: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.4,
  },
  doneSub: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  doneBtn: {
    marginTop: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  doneBtnText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
});

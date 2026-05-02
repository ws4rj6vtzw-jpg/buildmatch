import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AvatarPicker } from "@/components/AvatarPicker";
import { Pill } from "@/components/Pill";
import { ProModal } from "@/components/ProModal";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSubscription } from "@/lib/revenuecat";

export default function ProfileScreen() {
  const colors = useColors();
  const { mode: themeMode, setMode: setThemeMode } = useTheme();
  const { user, signOut, setRole, updateProfile } = useAuth();
  const { matches, swipes, jobs, ratings, completedSnaps } = useData();
  const { purchaseWorkerPro, restorePurchases } = useSubscription();
  const [copied, setCopied] = useState(false);
  const [proModalVisible, setProModalVisible] = useState(false);

  if (!user) return null;
  const isWorker = user.role === "worker";

  // Stable referral code from user id
  const referralCode = ("BM-" + user.id.replace(/\D/g, "").slice(0, 6).padEnd(6, "0")).toUpperCase();
  const profileSlug = user.id.slice(0, 8);
  const profileUrl = `https://buildmatch.app/u/${profileSlug}`;

  const handleInvite = async () => {
    const name = isWorker ? (user.fullName ?? "A tradie") : (user.companyName ?? "A builder");
    const message = isWorker
      ? `${name} is on BuildMatch — the app connecting tradespeople with builders across the UK. Join free and find your next job 👷\n\nhttps://buildmatch.app/join?ref=${referralCode}`
      : `${name} is hiring on BuildMatch — connecting UK builders with skilled tradespeople. Find great workers fast 🔨\n\nhttps://buildmatch.app/join?ref=${referralCode}`;
    try {
      await Share.share({ message, url: `https://buildmatch.app/join?ref=${referralCode}` });
    } catch {
      // dismissed
    }
  };

  const handleCopyLink = () => {
    if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      Alert.alert("Profile link", profileUrl, [{ text: "OK" }]);
    }
  };

  const onSignOut = () => {
    if (Platform.OS === "web") {
      signOut().then(() => router.replace("/onboarding/phone"));
    } else {
      Alert.alert("Sign out?", "You can sign back in any time.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => signOut().then(() => router.replace("/onboarding/phone")),
        },
      ]);
    }
  };

  const onSwitchRole = async () => {
    const next = isWorker ? "builder" : "worker";
    await setRole(next);
    router.replace("/onboarding/profile");
  };

  // Ratings received by me
  const myRatings = useMemo(
    () => ratings.filter((r) => r.toId === user.id),
    [ratings, user.id],
  );

  const avgRating = useMemo(() => {
    if (myRatings.length === 0) return null;
    return myRatings.reduce((s, r) => s + r.stars, 0) / myRatings.length;
  }, [myRatings]);

  // My completed snaps
  const mySnaps = useMemo(
    () =>
      completedSnaps.filter((s) =>
        isWorker ? s.workerId === user.id : s.builderId === user.id,
      ),
    [completedSnaps, isWorker, user.id],
  );

  // Estimated earnings/spend: payRate * durationDays * 8hrs (if hourly)
  const totalDollars = useMemo(
    () =>
      mySnaps.reduce((sum, s) => {
        const daily = s.payType === "hour" ? s.payRate * 8 : s.payRate;
        return sum + daily * s.durationDays;
      }, 0),
    [mySnaps],
  );

  // Active jobs in progress (workers matched to an active job)
  const activeJobs = useMemo(() => {
    if (isWorker) {
      return matches.filter((m) => {
        if (!m.jobId) return false;
        return jobs.some((j) => j.id === m.jobId);
      });
    }
    return jobs.filter((j) => j.builderId === user.id);
  }, [isWorker, matches, jobs, user.id]);

  const stats = [
    { label: "Matches", value: matches.length },
    {
      label: isWorker ? "Applied" : "Posted",
      value: isWorker
        ? swipes.filter((s) => s.direction === "right").length
        : jobs.filter((j) => j.builderId === user.id).length,
    },
    {
      label: "Rating",
      value: avgRating !== null ? avgRating.toFixed(1) : (user.rating ?? 0).toFixed(1),
    },
  ];

  const activityCards = isWorker
    ? [
        {
          icon: "check-circle" as const,
          label: "Jobs completed",
          value: mySnaps.length.toString(),
          color: colors.primary,
        },
        {
          icon: "dollar-sign" as const,
          label: "Est. earnings",
          value: totalDollars > 0 ? `£${Math.round(totalDollars).toLocaleString()}` : "£0",
          color: colors.accent,
        },
        {
          icon: "briefcase" as const,
          label: "Active now",
          value: activeJobs.length.toString(),
          color: colors.secondary,
        },
        {
          icon: "star" as const,
          label: "Reviews",
          value: myRatings.length.toString(),
          color: colors.primary,
        },
      ]
    : [
        {
          icon: "check-circle" as const,
          label: "Jobs completed",
          value: mySnaps.length.toString(),
          color: colors.primary,
        },
        {
          icon: "dollar-sign" as const,
          label: "Est. spend",
          value: totalDollars > 0 ? `£${Math.round(totalDollars).toLocaleString()}` : "£0",
          color: colors.accent,
        },
        {
          icon: "users" as const,
          label: "Hired",
          value: matches.length.toString(),
          color: colors.secondary,
        },
        {
          icon: "star" as const,
          label: "Reviews",
          value: myRatings.length.toString(),
          color: colors.primary,
        },
      ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Profile" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ alignItems: "center", gap: 12 }}>
            <AvatarPicker
              uri={user.photo}
              name={isWorker ? user.fullName : user.companyName}
              size={88}
              onChange={(uri) => updateProfile({ photo: uri })}
            />
            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={[styles.name, { color: colors.foreground }]}>
                {isWorker ? user.fullName : user.companyName}
              </Text>
              <Text style={[styles.role, { color: colors.primary }]}>
                {isWorker ? user.primaryTrade : `Builder · ${user.contactName ?? ""}`}
              </Text>
              <Text style={[styles.location, { color: colors.mutedForeground }]}>
                {user.suburb}{user.postcode ? `, ${user.postcode}` : ""}
              </Text>
              {user.isPro && (
                <View style={[styles.proBadge, { backgroundColor: colors.accent + "22", borderColor: colors.accent + "55" }]}>
                  <Feather name="award" size={11} color={colors.accent} />
                  <Text style={[styles.proBadgeText, { color: colors.accent }]}>
                    {isWorker ? "Pro Member" : "Pro · Unlimited"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.label} style={styles.stat}>
                <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Activity stats */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, gap: 14 }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            {isWorker ? "Your activity" : "Hiring activity"}
          </Text>
          <View style={styles.activityGrid}>
            {activityCards.map((card) => (
              <View
                key={card.label}
                style={[styles.activityCell, { backgroundColor: colors.elevated }]}
              >
                <View style={[styles.activityIcon, { backgroundColor: card.color + "22" }]}>
                  <Feather name={card.icon} size={16} color={card.color} />
                </View>
                <Text style={[styles.activityValue, { color: colors.foreground }]}>
                  {card.value}
                </Text>
                <Text style={[styles.activityLabel, { color: colors.mutedForeground }]}>
                  {card.label}
                </Text>
              </View>
            ))}
          </View>

          {mySnaps.length > 0 && (
            <View style={{ gap: 8 }}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                Recent completions
              </Text>
              {mySnaps.slice(-3).reverse().map((s) => (
                <View
                  key={s.jobId}
                  style={[styles.snapRow, { borderColor: colors.border }]}
                >
                  <View
                    style={[styles.snapDot, { backgroundColor: colors.primary + "33" }]}
                  >
                    <Feather name="check" size={12} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.snapTitle, { color: colors.foreground }]} numberOfLines={1}>
                      {s.title}
                    </Text>
                    <Text style={[styles.snapMeta, { color: colors.mutedForeground }]}>
                      {s.trade}  ·  {s.durationDays}d  ·  £{s.payType === "hour" ? `${s.payRate}/hr` : `${s.payRate}/day`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Pro upgrade / status card */}
        {isWorker && !user.isPro && (
          <Pressable
            onPress={() => setProModalVisible(true)}
            style={({ pressed }) => [
              styles.proCard,
              { backgroundColor: colors.accent + "14", borderColor: colors.accent + "44", opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <View style={[styles.proCardIcon, { backgroundColor: colors.accent }]}>
              <Feather name="award" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.proCardTitle, { color: colors.foreground }]}>Upgrade to Pro</Text>
              <Text style={[styles.proCardSub, { color: colors.mutedForeground }]}>
                Verified badge · Priority in searches · £9.99/mo
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.accent} />
          </Pressable>
        )}

        {user.bio ? (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>About</Text>
            <Text style={[styles.bio, { color: colors.foreground }]}>{user.bio}</Text>
          </View>
        ) : null}

        {isWorker && user.skills && user.skills.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Skills</Text>
            <View style={styles.pills}>
              {user.skills.map((s) => (
                <Pill key={s} label={s} />
              ))}
            </View>
          </View>
        )}

        {isWorker && user.tickets && user.tickets.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              Tickets & licences
            </Text>
            <View style={styles.pills}>
              {user.tickets.map((t) => (
                <Pill key={t} label={t} />
              ))}
            </View>
          </View>
        )}

        {/* Invite & share */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.inviteHeader}>
            <View style={[styles.inviteIconWrap, { backgroundColor: colors.primary + "22" }]}>
              <Feather name="users" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inviteTitle, { color: colors.foreground }]}>
                Invite a mate
              </Text>
              <Text style={[styles.inviteBody, { color: colors.mutedForeground }]}>
                {isWorker
                  ? "Know a tradie looking for work? Send them your link."
                  : "Know a builder who needs crew? Bring them on board."}
              </Text>
            </View>
          </View>

          {/* Referral code pill */}
          <View style={[styles.refCodeRow, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
            <Text style={[styles.refCodeLabel, { color: colors.mutedForeground }]}>Your code</Text>
            <Text style={[styles.refCode, { color: colors.primary }]}>{referralCode}</Text>
          </View>

          {/* Action buttons */}
          <View style={styles.shareActions}>
            <Pressable
              onPress={handleInvite}
              style={({ pressed }) => [
                styles.shareBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, flex: 1 },
              ]}
            >
              <Feather name="share-2" size={16} color={colors.primaryForeground} />
              <Text style={[styles.shareBtnText, { color: colors.primaryForeground }]}>
                Share invite
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCopyLink}
              style={({ pressed }) => [
                styles.shareBtn,
                {
                  backgroundColor: colors.elevated,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                  flex: 1,
                },
              ]}
            >
              <Feather
                name={copied ? "check" : "link"}
                size={16}
                color={copied ? colors.success : colors.foreground}
              />
              <Text style={[styles.shareBtnText, { color: copied ? colors.success : colors.foreground }]}>
                {copied ? "Copied!" : "Copy profile"}
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.profileUrlText, { color: colors.mutedForeground }]} numberOfLines={1}>
            {profileUrl}
          </Text>
        </View>

        {/* Theme picker */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, gap: 12 }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            Appearance
          </Text>
          <View style={styles.themeRow}>
            {(
              [
                { value: "dark", icon: "moon", label: "Dark" },
                { value: "light", icon: "sun", label: "Light" },
                { value: "system", icon: "smartphone", label: "System" },
              ] as const
            ).map((opt) => {
              const active = themeMode === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setThemeMode(opt.value)}
                  style={({ pressed }) => [
                    styles.themeOpt,
                    {
                      backgroundColor: active ? colors.primary : colors.elevated,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Feather
                    name={opt.icon}
                    size={18}
                    color={active ? colors.primaryForeground : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.themeLabel,
                      { color: active ? colors.primaryForeground : colors.foreground },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Row
          icon="edit-3"
          label="Edit profile"
          onPress={() => router.push("/onboarding/profile")}
        />
        <Row
          icon="repeat"
          label={isWorker ? "Switch to builder" : "Switch to worker"}
          onPress={onSwitchRole}
        />
        <Row
          icon="refresh-cw"
          label="Restore purchases"
          onPress={restorePurchases}
        />
        <Row icon="log-out" label="Sign out" onPress={onSignOut} destructive />

        <Text style={[styles.fineprint, { color: colors.mutedForeground }]}>
          BuildMatch · v1.0 (MVP)
        </Text>
      </ScrollView>

      <ProModal
        visible={proModalVisible}
        onUpgrade={async () => {
          setProModalVisible(false);
          await purchaseWorkerPro();
        }}
        onClose={() => setProModalVisible(false)}
      />
    </View>
  );
}

function Row({
  icon,
  label,
  onPress,
  destructive,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const colors = useColors();
  const fg = destructive ? colors.destructive : colors.foreground;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={18} color={fg} />
      </View>
      <Text style={[styles.rowLabel, { color: fg }]}>{label}</Text>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: Platform.OS === "web" ? 120 : 40,
    gap: 12,
  },
  card: {
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    gap: 18,
  },
  name: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.5,
  },
  role: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  location: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: { alignItems: "center", gap: 2 },
  statValue: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  section: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  bio: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 21,
  },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  fineprint: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    marginTop: 16,
  },
  activityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  activityCell: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: 12,
    padding: 14,
    gap: 4,
    alignItems: "flex-start",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  activityValue: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.4,
  },
  activityLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_500Medium",
    letterSpacing: 0.2,
  },
  snapRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  snapDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  snapTitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  snapMeta: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_500Medium",
    marginTop: 2,
  },
  themeRow: {
    flexDirection: "row",
    gap: 8,
  },
  themeOpt: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  themeLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.2,
  },
  inviteHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  inviteIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  inviteBody: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 18,
  },
  refCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
  },
  refCodeLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  refCode: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: 2,
  },
  shareActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shareBtnText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  profileUrlText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    marginTop: 8,
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    marginTop: 4,
  },
  proBadgeText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: 0.3,
  },
  proCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  proCardIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  proCardTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  proCardSub: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    marginTop: 2,
  },
});

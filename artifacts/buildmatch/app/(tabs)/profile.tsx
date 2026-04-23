import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

export default function ProfileScreen() {
  const colors = useColors();
  const { user, signOut, setRole } = useAuth();
  const { matches, swipes, jobs } = useData();

  if (!user) return null;
  const isWorker = user.role === "worker";

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

  const stats = [
    { label: "Matches", value: matches.length },
    { label: isWorker ? "Applied" : "Posted", value: isWorker ? swipes.filter((s) => s.direction === "right").length : jobs.filter((j) => j.builderId === user.id).length },
    { label: "Rating", value: (user.rating ?? 0).toFixed(1) },
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
            <Avatar uri={user.photo} name={isWorker ? user.fullName : user.companyName} size={88} />
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
        <Row icon="log-out" label="Sign out" onPress={onSignOut} destructive />

        <Text style={[styles.fineprint, { color: colors.mutedForeground }]}>
          BuildMatch · v1.0 (MVP)
        </Text>
      </ScrollView>
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
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  role: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  location: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: { alignItems: "center", gap: 2 },
  statValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
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
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  bio: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
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
    fontFamily: "Inter_500Medium",
  },
  fineprint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 16,
  },
});

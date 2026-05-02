import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types";

export default function RoleScreen() {
  const colors = useColors();
  const { setRole } = useAuth();
  const [selected, setSelected] = useState<Role | null>(null);

  const onContinue = async () => {
    if (!selected) return;
    await setRole(selected);
    router.replace("/onboarding/disclaimer");
  };

  const Card = ({
    role,
    icon,
    title,
    description,
  }: {
    role: Role;
    icon: keyof typeof Feather.glyphMap;
    title: string;
    description: string;
  }) => {
    const isActive = selected === role;
    return (
      <Pressable
        onPress={() => setSelected(role)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isActive ? colors.primary : colors.card,
            borderColor: isActive ? colors.primary : colors.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: isActive ? colors.primaryForeground : colors.secondary,
            },
          ]}
        >
          <Feather
            name={icon}
            size={26}
            color={isActive ? colors.primary : colors.foreground}
          />
        </View>
        <View style={styles.cardText}>
          <Text
            style={[
              styles.cardTitle,
              { color: isActive ? colors.primaryForeground : colors.foreground },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.cardDesc,
              {
                color: isActive
                  ? "rgba(14,15,18,0.7)"
                  : colors.mutedForeground,
              },
            ]}
          >
            {description}
          </Text>
        </View>
        {isActive && (
          <Feather name="check-circle" size={22} color={colors.primaryForeground} />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          What brings you here?
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          You can switch this later in settings.
        </Text>

        <View style={styles.cards}>
          <Card
            role="builder"
            icon="briefcase"
            title="I'm a builder"
            description="Find skilled workers for your jobs and crews."
          />
          <Card
            role="worker"
            icon="tool"
            title="I'm a worker"
            description="Get matched with jobs that suit your trade."
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={onContinue} disabled={!selected} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, padding: 24, paddingTop: 36, gap: 14 },
  title: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 22,
  },
  cards: { gap: 12, marginTop: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 18,
    borderWidth: 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1, gap: 3 },
  cardTitle: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: -0.3,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "web" ? 50 : 24,
  },
});

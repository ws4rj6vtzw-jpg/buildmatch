import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const colors = useColors();
  const { user, loading, locked, security } = useAuth();

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) return <Redirect href="/onboarding/phone" />;
  if (!user.profileComplete) return <Redirect href="/onboarding/profile" />;

  if (locked) return <Redirect href="/welcome-back" />;

  if (!security?.prompted) return <Redirect href="/onboarding/pin-setup" />;

  return <Redirect href="/(tabs)/discover" />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});

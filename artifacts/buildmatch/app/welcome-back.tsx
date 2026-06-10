import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PinPad } from "@/components/PinPad";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

// NOTE: expo-local-authentication native module is not yet in the current
// binary — biometric unlock will be enabled automatically in the next build
// once the module is compiled in. For now, PIN-only unlock.

export default function WelcomeBack() {
  const colors = useColors();
  const { user, security, unlock, signOut } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const displayName = user?.fullName || user?.contactName || "there";
  const firstName = displayName.split(" ")[0];
  const initials = firstName.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (pin.length !== 4) return;
    if (pin === security?.pin) {
      unlock();
      router.replace("/(tabs)/discover");
    } else {
      setError("Incorrect PIN");
      setShake(true);
      setTimeout(() => {
        setPin("");
        setError("");
        setShake(false);
      }, 700);
    }
  }, [pin, security, unlock]);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      "Sign out",
      "This will remove your account from this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/onboarding/phone");
          },
        },
      ],
    );
  }, [signOut]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.initials, { color: colors.primaryForeground }]}>
            {initials}
          </Text>
        </View>
        <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
          Welcome back,
        </Text>
        <Text style={[styles.name, { color: colors.foreground }]}>{firstName}</Text>
      </View>

      <View style={styles.middle}>
        {error ? (
          <Text style={[styles.hint, { color: colors.destructive }]}>{error}</Text>
        ) : (
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>
            Enter your PIN
          </Text>
        )}
        <View style={shake ? styles.shake : undefined}>
          <PinPad value={pin} onChange={setPin} />
        </View>
      </View>

      <View style={styles.bottom}>
        <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
          <Text style={[styles.signOutText, { color: colors.mutedForeground }]}>
            Not you? Sign out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  top: {
    alignItems: "center",
    paddingTop: 56,
    gap: 6,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  initials: {
    fontSize: 36,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  greeting: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  name: {
    fontSize: 30,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  hint: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  shake: {
    transform: [{ translateX: 8 }],
  },
  bottom: {
    alignItems: "center",
    paddingBottom: 8,
  },
  signOutBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  signOutText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },
});

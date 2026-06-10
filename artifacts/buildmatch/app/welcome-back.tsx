import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PinPad } from "@/components/PinPad";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

// Lazy-load so the import only runs when this screen is mounted,
// not at bundle startup (Expo Router eagerly requires all route files —
// a static import of expo-local-authentication crashes the app on launch
// if the native module wasn't compiled into the current binary).
type LocalAuthModule = {
  hasHardwareAsync: () => Promise<boolean>;
  isEnrolledAsync: () => Promise<boolean>;
  authenticateAsync: (opts: {
    promptMessage: string;
    cancelLabel: string;
    disableDeviceFallback: boolean;
  }) => Promise<{ success: boolean }>;
};

function getLocalAuth(): LocalAuthModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-local-authentication") as LocalAuthModule;
  } catch {
    return null;
  }
}

export default function WelcomeBack() {
  const colors = useColors();
  const { user, security, unlock, signOut } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [shake, setShake] = useState(false);

  const displayName = user?.fullName || user?.contactName || "there";
  const firstName = displayName.split(" ")[0];
  const initials = firstName.slice(0, 2).toUpperCase();

  const tryBiometric = useCallback(async () => {
    const LA = getLocalAuth();
    if (!LA) return;
    try {
      const result = await LA.authenticateAsync({
        promptMessage: "Unlock BuildMatch",
        cancelLabel: "Use PIN",
        disableDeviceFallback: true,
      });
      if (result.success) {
        unlock();
        router.replace("/(tabs)/discover");
      }
    } catch {
      // biometric unavailable at runtime — fall back to PIN
    }
  }, [unlock]);

  useEffect(() => {
    (async () => {
      const LA = getLocalAuth();
      if (!LA) return;
      try {
        const hw = await LA.hasHardwareAsync();
        const enrolled = await LA.isEnrolledAsync();
        const available = hw && enrolled;
        setBiometricAvailable(available);
        if (available) tryBiometric();
      } catch {
        // device doesn't support local auth
      }
    })();
  }, [tryBiometric]);

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

  const handleSignOut = () => {
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
  };

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
        {biometricAvailable && (
          <Pressable
            onPress={tryBiometric}
            style={[styles.biometricBtn, { borderColor: colors.border }]}
          >
            <Feather name="smile" size={18} color={colors.primary} />
            <Text style={[styles.biometricText, { color: colors.primary }]}>
              Use Face ID / Fingerprint
            </Text>
          </Pressable>
        )}

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
    gap: 4,
    paddingBottom: 8,
  },
  biometricBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  biometricText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
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

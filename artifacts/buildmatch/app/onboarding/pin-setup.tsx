import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PinPad } from "@/components/PinPad";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

type Step = "enter" | "confirm";

export default function PinSetup() {
  const colors = useColors();
  const { setupPin, skipLock } = useAuth();
  const [step, setStep] = useState<Step>("enter");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [error, setError] = useState("");

  const pin = step === "enter" ? first : second;
  const setPin = step === "enter" ? setFirst : setSecond;

  useEffect(() => {
    if (step === "enter" && first.length === 4) {
      setTimeout(() => setStep("confirm"), 150);
    }
  }, [first, step]);

  useEffect(() => {
    if (step === "confirm" && second.length === 4) {
      if (second === first) {
        setupPin(first).then(() => router.replace("/(tabs)/discover"));
      } else {
        setError("PINs don't match — try again");
        setTimeout(() => {
          setSecond("");
          setFirst("");
          setStep("enter");
          setError("");
        }, 800);
      }
    }
  }, [second, first, step, setupPin]);

  const handleSkip = async () => {
    await skipLock();
    router.replace("/(tabs)/discover");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <View style={[styles.iconWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.icon}>🔒</Text>
        </View>
        <Text style={[styles.heading, { color: colors.foreground }]}>
          Secure your account
        </Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          {step === "enter"
            ? "Choose a 4-digit PIN to lock BuildMatch"
            : "Re-enter your PIN to confirm"}
        </Text>
      </View>

      <View style={styles.middle}>
        {error ? (
          <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
        ) : null}
        <PinPad value={pin} onChange={setPin} />
      </View>

      <Pressable onPress={handleSkip} style={styles.skipBtn}>
        <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
          Skip for now
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  top: {
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 32,
    gap: 10,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: { fontSize: 36 },
  heading: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans_700Bold",
    textAlign: "center",
  },
  sub: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  errorText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  skipBtn: {
    alignSelf: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  skipText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
  },
});

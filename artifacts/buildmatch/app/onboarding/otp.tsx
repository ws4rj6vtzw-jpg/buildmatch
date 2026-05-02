import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";

const CELLS = 6;

export default function OtpScreen() {
  const colors = useColors();
  const { pendingPhone, verifyOtp } = useAuth();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const onVerify = async () => {
    setSubmitting(true);
    const ok = await verifyOtp(code);
    setSubmitting(false);
    if (ok) {
      router.replace("/onboarding/role");
    } else {
      Alert.alert("Invalid code", "Enter any 6-digit code to continue (demo).");
    }
  };

  const cells = Array.from({ length: CELLS }).map((_, i) => code[i] ?? "");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Enter the 6-digit code
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Sent to +44 {pendingPhone ?? ""}. For this demo any 6 digits will work.
          </Text>

          <Pressable onPress={() => inputRef.current?.focus()} style={styles.cellRow}>
            {cells.map((char, i) => {
              const active = i === code.length;
              return (
                <View
                  key={i}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: colors.card,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.cellText, { color: colors.foreground }]}>
                    {char}
                  </Text>
                </View>
              );
            })}
          </Pressable>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, "").slice(0, CELLS))}
            keyboardType="number-pad"
            style={styles.hiddenInput}
            autoFocus
            maxLength={CELLS}
          />

          <Pressable onPress={() => router.back()}>
            <Text style={[styles.link, { color: colors.primary }]}>
              Wrong number? Go back
            </Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="Verify"
            onPress={onVerify}
            disabled={code.length !== CELLS}
            loading={submitting}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { flex: 1, padding: 24, paddingTop: 36, gap: 16 },
  title: {
    fontSize: 28,
    fontFamily: "SpaceGrotesk_700Bold",
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "SpaceGrotesk_400Regular",
    lineHeight: 22,
  },
  cellRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    justifyContent: "space-between",
  },
  cell: {
    flex: 1,
    aspectRatio: 0.85,
    maxHeight: 64,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 26,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 1,
    width: 1,
  },
  link: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk_500Medium",
    marginTop: 12,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "web" ? 50 : 24,
  },
});

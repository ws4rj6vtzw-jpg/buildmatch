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
  const { pendingPhone, sendOtp, verifyOtp } = useAuth();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const onVerify = async () => {
    setSubmitting(true);
    const result = await verifyOtp(code);
    setSubmitting(false);
    if (result.ok) {
      router.replace("/onboarding/role");
    } else {
      Alert.alert("Incorrect code", result.error ?? "Please try again.");
      setCode("");
      inputRef.current?.focus();
    }
  };

  const onResend = async () => {
    if (!pendingPhone) return;
    setResending(true);
    const result = await sendOtp(pendingPhone);
    setResending(false);
    if (result.ok) {
      Alert.alert("Code sent", "A new code has been sent to your phone.");
      setCode("");
    } else {
      Alert.alert("Could not resend", result.error ?? "Please try again.");
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
            Sent to +44 {pendingPhone ?? ""}. Check your messages.
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

          <View style={styles.linksRow}>
            <Pressable onPress={() => router.back()}>
              <Text style={[styles.link, { color: colors.mutedForeground }]}>
                Wrong number?
              </Text>
            </Pressable>
            <Pressable onPress={onResend} disabled={resending}>
              <Text style={[styles.link, { color: colors.primary, opacity: resending ? 0.5 : 1 }]}>
                {resending ? "Sending…" : "Resend code"}
              </Text>
            </Pressable>
          </View>
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
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
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
    fontFamily: "PlusJakartaSans_700Bold",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 1,
    width: 1,
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  link: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "web" ? 50 : 24,
  },
});

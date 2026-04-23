import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";

export default function PhoneScreen() {
  const colors = useColors();
  const { setPendingPhone } = useAuth();
  const [phone, setPhone] = useState("");

  const valid = phone.replace(/\D/g, "").length >= 10;

  const onContinue = () => {
    setPendingPhone(phone);
    router.push("/onboarding/otp");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
            <Feather name="tool" size={28} color={colors.primaryForeground} />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            Find your next job.{"\n"}Or your next worker.
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Enter your mobile number to get started. We'll text you a code.
          </Text>

          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.prefix, { color: colors.mutedForeground }]}>+44</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="7911 123456"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              style={[styles.input, { color: colors.foreground }]}
              autoFocus
            />
          </View>

          <Text style={[styles.fineprint, { color: colors.mutedForeground }]}>
            By continuing you agree to BuildMatch's terms and acknowledge our privacy policy.
          </Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Send code" onPress={onContinue} disabled={!valid} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { flex: 1, padding: 24, paddingTop: 36, gap: 18 },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
    marginTop: 10,
  },
  prefix: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    paddingVertical: 0,
  },
  fineprint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "web" ? 50 : 24,
  },
});

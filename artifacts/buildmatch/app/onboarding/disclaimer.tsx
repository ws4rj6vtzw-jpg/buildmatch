import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";

const CLAUSES = [
  {
    icon: "shield" as const,
    heading: "Insurance is your responsibility",
    body: "BuildMatch is an introduction platform only. All parties are responsible for holding appropriate insurance — including public liability, employers' liability, and tools cover — before any work begins.",
  },
  {
    icon: "user-check" as const,
    heading: "Verify before you hire",
    body: "Builders must verify a worker's certifications (CSCS, ECS, etc.) and insurance independently. BuildMatch does not guarantee the accuracy of any profile information.",
  },
  {
    icon: "briefcase" as const,
    heading: "No employment relationship",
    body: "Connecting through BuildMatch does not create an employment relationship between any user and BuildMatch. Parties are responsible for complying with UK employment law and IR35 where applicable.",
  },
  {
    icon: "alert-triangle" as const,
    heading: "On-site safety",
    body: "The hiring party is responsible for site safety, CDM regulations compliance, and all health & safety obligations. BuildMatch accepts no liability for accidents or injuries on site.",
  },
  {
    icon: "file-text" as const,
    heading: "Disputes & defective work",
    body: "Any disputes over payment, workmanship, or conduct must be resolved directly between the parties. BuildMatch is not liable for losses arising from any engagement made through the platform.",
  },
];

export default function DisclaimerScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const isWorker = user?.role === "worker";

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedInsurance, setAgreedInsurance] = useState(false);

  const canContinue = agreedTerms && agreedInsurance;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
            <Feather name="shield" size={28} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Before you continue
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            BuildMatch connects builders and workers. Please read and agree to your responsibilities.
          </Text>
        </View>

        {/* Clauses */}
        <View style={styles.clauses}>
          {CLAUSES.map((c, i) => (
            <View
              key={i}
              style={[styles.clause, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.clauseIcon, { backgroundColor: colors.elevated }]}>
                <Feather name={c.icon} size={16} color={colors.primary} />
              </View>
              <View style={styles.clauseText}>
                <Text style={[styles.clauseHeading, { color: colors.foreground }]}>
                  {c.heading}
                </Text>
                <Text style={[styles.clauseBody, { color: colors.mutedForeground }]}>
                  {c.body}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Checkboxes */}
        <View style={[styles.checkboxSection, { borderColor: colors.border }]}>
          <Checkbox
            checked={agreedInsurance}
            onToggle={() => setAgreedInsurance((v) => !v)}
            label={
              isWorker
                ? "I understand I must hold valid public liability insurance before accepting any work through BuildMatch."
                : "I understand I must verify workers' insurance and certifications before allowing them on site."
            }
            colors={colors}
          />
          <Checkbox
            checked={agreedTerms}
            onToggle={() => setAgreedTerms((v) => !v)}
            label="I have read and agree to BuildMatch's Terms of Service, Privacy Policy, and the responsibilities set out above."
            colors={colors}
          />
        </View>

        <View style={{ height: 8 }} />
        <PrimaryButton
          label="I Agree & Continue"
          onPress={() => router.replace("/onboarding/profile")}
          disabled={!canContinue}
        />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Checkbox({
  checked,
  onToggle,
  label,
  colors,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable onPress={onToggle} style={styles.checkboxRow}>
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? colors.primary : colors.card,
            borderColor: checked ? colors.primary : colors.border,
          },
        ]}
      >
        {checked && (
          <Feather name="check" size={13} color={colors.primaryForeground} />
        )}
      </View>
      <Text style={[styles.checkboxLabel, { color: colors.foreground }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    padding: 24,
    paddingTop: 28,
    paddingBottom: Platform.OS === "web" ? 80 : 40,
    gap: 20,
  },
  header: { alignItems: "center", gap: 12, paddingBottom: 4 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 300,
  },
  clauses: { gap: 10 },
  clause: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  clauseIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  clauseText: { flex: 1, gap: 3 },
  clauseHeading: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.1,
  },
  clauseBody: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  checkboxSection: {
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  checkboxRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
});

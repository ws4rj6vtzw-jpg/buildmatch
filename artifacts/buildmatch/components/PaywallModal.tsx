import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type Props = {
  visible: boolean;
  usedCount: number;
  onGoPro: (tier: "basic" | "pro") => void;
  onClose: () => void;
};

const BASIC_FEATURES = [
  "Post unlimited job requirements",
  "Browse & contact verified workers",
  "£5 per successful match",
  "Direct in-app messaging",
];

const PRO_FEATURES = [
  "Everything in Basic",
  "£5 per successful match",
  "Boost job listings to top of feed",
  "Verified builder badge",
  "Priority support & analytics",
];

export function PaywallModal({ visible, usedCount, onGoPro, onClose }: Props) {
  const colors = useColors();
  const [selected, setSelected] = useState<"basic" | "pro">("pro");

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.bg}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
            <Feather name="zap" size={28} color={colors.primaryForeground} />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            Hire smarter, pay less
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Simple subscription + £5 per successful match. No agency fees, ever.
          </Text>

          {/* Tier selector */}
          <View style={styles.tiers}>
            {/* Basic */}
            <Pressable
              onPress={() => setSelected("basic")}
              style={[
                styles.tier,
                {
                  borderColor: selected === "basic" ? colors.primary : colors.border,
                  backgroundColor: selected === "basic" ? colors.primary + "14" : colors.elevated,
                },
              ]}
            >
              <View style={styles.tierHeader}>
                <Text style={[styles.tierName, { color: colors.foreground }]}>Basic</Text>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.tierPrice, { color: selected === "basic" ? colors.primary : colors.foreground }]}>£14.90</Text>
                  <Text style={[styles.tierUnit, { color: colors.mutedForeground }]}>/month</Text>
                </View>
              </View>
              <Text style={[styles.tierMatchFee, { color: colors.accent }]}>+ £5 per match</Text>
              <View style={styles.featureList}>
                {BASIC_FEATURES.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check" size={12} color={selected === "basic" ? colors.primary : colors.mutedForeground} />
                    <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f}</Text>
                  </View>
                ))}
              </View>
              {selected === "basic" && (
                <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />
              )}
            </Pressable>

            {/* Pro */}
            <Pressable
              onPress={() => setSelected("pro")}
              style={[
                styles.tier,
                {
                  borderColor: selected === "pro" ? colors.primary : colors.border,
                  backgroundColor: selected === "pro" ? colors.primary + "14" : colors.elevated,
                },
              ]}
            >
              <View style={styles.tierHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={[styles.tierName, { color: colors.foreground }]}>Pro</Text>
                  <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.badgeText, { color: "#fff" }]}>Best value</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.tierPrice, { color: selected === "pro" ? colors.primary : colors.foreground }]}>£24.90</Text>
                  <Text style={[styles.tierUnit, { color: colors.mutedForeground }]}>/month</Text>
                </View>
              </View>
              <Text style={[styles.tierMatchFee, { color: colors.accent }]}>+ £5 per match</Text>
              <View style={styles.featureList}>
                {PRO_FEATURES.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check" size={12} color={selected === "pro" ? colors.primary : colors.mutedForeground} />
                    <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f}</Text>
                  </View>
                ))}
              </View>
              {selected === "pro" && (
                <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={() => onGoPro(selected)}
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="zap" size={15} color={colors.primaryForeground} />
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
              Subscribe — £{selected === "basic" ? "14.90" : "24.90"}/month
            </Text>
          </Pressable>

          <Text style={[styles.legal, { color: colors.mutedForeground }]}>
            £5 charged per successful match. Cancel any time.
          </Text>

          <Pressable onPress={onClose} style={{ alignSelf: "center" }}>
            <Text style={[styles.cancel, { color: colors.mutedForeground }]}>Maybe later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    gap: 14,
    alignItems: "stretch",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.4,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  tiers: {
    flexDirection: "row",
    gap: 10,
  },
  tier: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    gap: 6,
  },
  tierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tierName: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  tierPrice: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  tierUnit: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  tierMatchFee: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  featureList: {
    gap: 5,
    marginTop: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
    flex: 1,
    lineHeight: 16,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: "center",
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: 0.2,
  },
  btn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  btnText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  legal: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    lineHeight: 16,
  },
  cancel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },
});

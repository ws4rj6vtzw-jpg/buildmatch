import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type Props = {
  visible: boolean;
  onUpgrade: () => void;
  onClose: () => void;
};

const BENEFITS = [
  { icon: "award" as const, text: "Verified Pro badge on your profile" },
  { icon: "trending-up" as const, text: "Priority placement in builder searches" },
  { icon: "bell" as const, text: "First access to new job postings" },
  { icon: "bar-chart-2" as const, text: "Application insights & analytics" },
  { icon: "shield" as const, text: "Dedicated support line" },
];

export function ProModal({ visible, onUpgrade, onClose }: Props) {
  const colors = useColors();

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.bg}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={styles.header}>
            <View style={[styles.iconWrap, { backgroundColor: colors.accent }]}>
              <Feather name="award" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.foreground }]}>BuildMatch Pro</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                For serious tradespeople
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.price, { color: colors.accent }]}>£9.99</Text>
              <Text style={[styles.priceUnit, { color: colors.mutedForeground }]}>/month</Text>
            </View>
          </View>

          <View style={[styles.trialBanner, { backgroundColor: colors.accent + "18", borderColor: colors.accent + "44" }]}>
            <Feather name="gift" size={15} color={colors.accent} />
            <Text style={[styles.trialText, { color: colors.accent }]}>
              7-day free trial — cancel any time
            </Text>
          </View>

          <View style={styles.benefits}>
            {BENEFITS.map(({ icon, text }) => (
              <View key={text} style={styles.benefitRow}>
                <View style={[styles.benefitIcon, { backgroundColor: colors.accent + "1A" }]}>
                  <Feather name={icon} size={14} color={colors.accent} />
                </View>
                <Text style={[styles.benefitText, { color: colors.foreground }]}>{text}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={onUpgrade}
            style={({ pressed }) => [
              styles.upgradeBtn,
              { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="award" size={17} color="#fff" />
            <Text style={styles.upgradeBtnText}>Start free trial</Text>
          </Pressable>

          <Text style={[styles.legal, { color: colors.mutedForeground }]}>
            £9.99/month after trial. Cancel any time from your profile.
          </Text>

          <Pressable onPress={onClose} style={{ alignSelf: "center" }}>
            <Text style={[styles.cancel, { color: colors.mutedForeground }]}>Not now</Text>
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
    gap: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  price: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  priceUnit: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  trialBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  trialText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  benefits: {
    gap: 12,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  upgradeBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  upgradeBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  legal: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 16,
  },
  cancel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});

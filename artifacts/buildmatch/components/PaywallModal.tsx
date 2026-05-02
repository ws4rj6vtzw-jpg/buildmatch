import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const FREE_LIMIT = 5;

type Props = {
  visible: boolean;
  usedCount: number;
  onPayPerHire: () => void;
  onGoPro: () => void;
  onClose: () => void;
};

const PRO_FEATURES = [
  "Unlimited worker matches",
  "Boost job listings to top of feed",
  "Verified builder badge",
  "Priority support",
];

export function PaywallModal({ visible, usedCount, onPayPerHire, onGoPro, onClose }: Props) {
  const colors = useColors();

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.bg}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
            <Feather name="zap" size={28} color={colors.primaryForeground} />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            {usedCount >= FREE_LIMIT
              ? "All 5 free matches used"
              : `${FREE_LIMIT - usedCount} free match${FREE_LIMIT - usedCount === 1 ? "" : "es"} left`}
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Keep hiring with a single match or unlock unlimited access with BuildMatch Pro.
          </Text>

          <View style={[styles.option, { borderColor: colors.border, backgroundColor: colors.elevated }]}>
            <View style={styles.optRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optTitle, { color: colors.foreground }]}>Pay per hire</Text>
                <Text style={[styles.optDesc, { color: colors.mutedForeground }]}>
                  One match, no commitment
                </Text>
              </View>
              <Text style={[styles.price, { color: colors.foreground }]}>
                £25
              </Text>
            </View>
            <Pressable
              onPress={onPayPerHire}
              style={({ pressed }) => [
                styles.btn,
                { borderWidth: 1, borderColor: colors.primary, backgroundColor: "transparent", opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Text style={[styles.btnText, { color: colors.primary }]}>Unlock this match — £25</Text>
            </Pressable>
          </View>

          <View style={styles.orRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.orText, { color: colors.mutedForeground }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <View style={[styles.option, { borderColor: colors.primary, backgroundColor: colors.primary + "14" }]}>
            <View style={styles.optRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[styles.optTitle, { color: colors.foreground }]}>BuildMatch Pro</Text>
                  <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.badgeText, { color: "#fff" }]}>Best value</Text>
                  </View>
                </View>
                <Text style={[styles.optDesc, { color: colors.mutedForeground }]}>
                  Unlimited hiring
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.price, { color: colors.primary }]}>£49</Text>
                <Text style={[styles.priceUnit, { color: colors.mutedForeground }]}>/mo</Text>
              </View>
            </View>

            <View style={styles.features}>
              {PRO_FEATURES.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Feather name="check" size={13} color={colors.accent} />
                  <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f}</Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={onGoPro}
              style={({ pressed }) => [
                styles.btn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="zap" size={15} color={colors.primaryForeground} />
              <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Go Pro — £49/month</Text>
            </Pressable>
          </View>

          <Pressable onPress={onClose} style={{ alignSelf: "center", marginTop: 14, marginBottom: 4 }}>
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
    fontFamily: "SpaceGrotesk_700Bold",
    letterSpacing: -0.4,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  option: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  optRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optTitle: {
    fontSize: 15,
    fontFamily: "SpaceGrotesk_600SemiBold",
  },
  optDesc: {
    fontSize: 12,
    fontFamily: "SpaceGrotesk_400Regular",
    marginTop: 2,
  },
  price: {
    fontSize: 22,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  priceUnit: {
    fontSize: 12,
    fontFamily: "SpaceGrotesk_400Regular",
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "SpaceGrotesk_700Bold",
    letterSpacing: 0.3,
  },
  features: {
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    fontFamily: "SpaceGrotesk_400Regular",
  },
  btn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  btnText: {
    fontSize: 15,
    fontFamily: "SpaceGrotesk_600SemiBold",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  orText: {
    fontSize: 12,
    fontFamily: "SpaceGrotesk_500Medium",
  },
  cancel: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk_500Medium",
  },
});

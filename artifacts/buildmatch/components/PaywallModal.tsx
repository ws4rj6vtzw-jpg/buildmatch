import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type Tier = "basic" | "pro" | "elite";

type Props = {
  visible: boolean;
  usedCount: number;
  onGoPro: (tier: Tier) => void;
  onClose: () => void;
};

type TierConfig = {
  id: Tier;
  name: string;
  price: string;
  badge?: string;
  placementFee: string;
  jobPosts: string;
  dmBefore: string;
  features: string[];
};

const TIERS: TierConfig[] = [
  {
    id: "basic",
    name: "Basic",
    price: "£14.90",
    placementFee: "£8 per placement",
    jobPosts: "3 job posts / month",
    dmBefore: "Matched workers only",
    features: [
      "Unlimited swipes",
      "Browse worker contact info",
      "3 job posts per month",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "£24.90",
    badge: "Popular",
    placementFee: "£5 per placement",
    jobPosts: "Unlimited job posts",
    dmBefore: "5 DMs / month before matching",
    features: [
      "Unlimited swipes",
      "Browse worker contact info",
      "Unlimited job posts",
      "5 DMs / month before matching",
      "Verified builder badge",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: "£49.90",
    badge: "Best value",
    placementFee: "No placement fee",
    jobPosts: "Unlimited job posts",
    dmBefore: "Unlimited before matching",
    features: [
      "Unlimited swipes",
      "Browse worker contact info",
      "Unlimited job posts",
      "Unlimited DMs before matching",
      "Verified builder badge",
      "Priority support & analytics",
      "Job listings boosted to top",
      "Profile boosted to top of discover",
    ],
  },
];

export function PaywallModal({ visible, usedCount, onGoPro, onClose }: Props) {
  const colors = useColors();
  const [selected, setSelected] = useState<Tier>("pro");
  const [loading, setLoading] = useState(false);

  const selectedTier = TIERS.find((t) => t.id === selected)!;

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await Promise.resolve(onGoPro(selected));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.bg}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
            <Feather name="zap" size={26} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Upgrade your BuildMatch
          </Text>
          {usedCount >= 5 && (
            <View style={[styles.limitBadge, { backgroundColor: "#F59E0B18", borderColor: "#F59E0B44" }]}>
              <Feather name="alert-circle" size={13} color="#F59E0B" />
              <Text style={[styles.limitText, { color: "#F59E0B" }]}>
                Free swipe limit reached — subscribe to keep hiring
              </Text>
            </View>
          )}

          {/* Tier selector — horizontal tabs */}
          <View style={[styles.tabRow, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
            {TIERS.map((tier) => (
              <Pressable
                key={tier.id}
                onPress={() => setSelected(tier.id)}
                style={[
                  styles.tab,
                  selected === tier.id && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    { color: selected === tier.id ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {tier.name}
                </Text>
                <Text
                  style={[
                    styles.tabPrice,
                    { color: selected === tier.id ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {tier.price}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Selected tier detail */}
          <View style={[styles.detailCard, { backgroundColor: colors.elevated, borderColor: colors.primary + "44" }]}>
            {selectedTier.badge && (
              <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.popularText}>{selectedTier.badge}</Text>
              </View>
            )}

            {/* Key stats row */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  {selectedTier.placementFee}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Placement fee
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {selectedTier.jobPosts}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Job posts
                </Text>
              </View>
            </View>

            {/* Feature list */}
            <View style={styles.featureList}>
              {selectedTier.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <View style={[styles.checkCircle, { backgroundColor: colors.primary + "22" }]}>
                    <Feather name="check" size={10} color={colors.primary} />
                  </View>
                  <Text style={[styles.featureText, { color: colors.foreground }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Subscribe button */}
          <Pressable
            onPress={handleSubscribe}
            disabled={loading}
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: colors.primary, opacity: pressed || loading ? 0.82 : 1 },
            ]}
          >
            <Feather name="zap" size={15} color={colors.primaryForeground} />
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
              {loading
                ? "Processing…"
                : `Subscribe to ${selectedTier.name} — ${selectedTier.price}/mo`}
            </Text>
          </Pressable>

          <Text style={[styles.legal, { color: colors.mutedForeground }]}>
            Billed monthly. Cancel any time from your profile.
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
    padding: 22,
    paddingBottom: 36,
    gap: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  limitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  limitText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
    flex: 1,
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  tabPrice: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  detailCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 12,
  },
  popularBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  popularText: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statValue: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_700Bold",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 32,
    marginHorizontal: 8,
  },
  featureList: {
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
    flex: 1,
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

import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/lib/revenuecat";
import { api } from "@/lib/api";

const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN ?? "buildmatch.online";
const API_BASE = `https://${DOMAIN}/api`;

type PaymentMethod = {
  hasCard: boolean;
  card?: { brand: string; last4: string; expMonth: number; expYear: number } | null;
};

const TIER_FEE: Record<string, number> = {
  free: 25_00,
  basic: 8_00,
  pro: 5_00,
  elite: 0,
};

function tierLabel(tier: string): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

function feeDisplay(pence: number): string {
  if (pence === 0) return "Free";
  return `£${(pence / 100).toFixed(0)}`;
}

export default function ConfirmHireScreen() {
  const colors = useColors();
  const { user, token } = useAuth();
  const { builderTier } = useSubscription();

  const params = useLocalSearchParams<{
    matchId: string;
    workerId: string;
    workerName: string;
    workerTrade?: string;
  }>();

  const { matchId, workerId, workerName, workerTrade } = params;
  const tier = builderTier === "none" ? "free" : builderTier;
  const amountPence = TIER_FEE[tier] ?? TIER_FEE.free;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const fetchPaymentMethod = useCallback(async () => {
    setLoading(true);
    const { data, error } = await api.getPaymentMethod();
    if (!error && data) setPaymentMethod(data as PaymentMethod);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPaymentMethod(); }, [fetchPaymentMethod]);

  async function openCardSetup() {
    const { data, error } = await api.createSetupIntent();
    if (error || !data) {
      Alert.alert("Error", "Could not start card setup. Please try again.");
      return;
    }
    const { clientSecret, publishableKey } = data as { clientSecret: string; publishableKey: string };
    const url = `${API_BASE}/payments/card-setup?secret=${encodeURIComponent(clientSecret)}&pk=${encodeURIComponent(publishableKey)}`;
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      toolbarColor: "#0f172a",
    });
    // Re-check after browser closes
    await fetchPaymentMethod();
  }

  async function handleConfirm() {
    if (amountPence > 0 && !paymentMethod?.hasCard) {
      Alert.alert("Card required", "Please add a card before confirming the hire.");
      return;
    }
    setConfirming(true);
    const { data, error } = await api.confirmHire({ matchId, workerId, tier });
    setConfirming(false);
    if (error) {
      Alert.alert("Payment failed", error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <View style={[styles.successIcon, { backgroundColor: colors.card }]}>
          <Text style={styles.successEmoji}>🎉</Text>
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Hire confirmed!</Text>
        <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
          {workerName} has been hired.
          {amountPence > 0
            ? ` A placement fee of ${feeDisplay(amountPence)} has been charged.`
            : " No placement fee on Elite."}
        </Text>
        <Pressable
          style={[styles.doneBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.doneBtnText, { color: colors.primaryForeground }]}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Confirm Hire</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Worker summary */}
      <View style={[styles.workerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.workerIcon, { backgroundColor: colors.primary + "22" }]}>
          <Text style={{ fontSize: 26 }}>👷</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.workerName, { color: colors.foreground }]}>{workerName}</Text>
          {workerTrade ? (
            <Text style={[styles.workerTrade, { color: colors.mutedForeground }]}>{workerTrade}</Text>
          ) : null}
        </View>
      </View>

      {/* Fee breakdown */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>PLACEMENT FEE</Text>
        <View style={styles.feeRow}>
          <Text style={[styles.feeLabel, { color: colors.foreground }]}>
            {tierLabel(tier)} tier rate
          </Text>
          <Text style={[styles.feeAmount, { color: amountPence === 0 ? "#22c55e" : colors.primary }]}>
            {feeDisplay(amountPence)}
          </Text>
        </View>
        {amountPence === 0 && (
          <Text style={[styles.feeNote, { color: "#22c55e" }]}>
            Elite members enjoy unlimited free placements 🎉
          </Text>
        )}
        {amountPence > 0 && (
          <Text style={[styles.feeNote, { color: colors.mutedForeground }]}>
            One-time fee charged when you confirm the hire. Upgrade your plan to reduce placement fees.
          </Text>
        )}
      </View>

      {/* Payment method */}
      {amountPence > 0 && (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>PAYMENT METHOD</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
          ) : paymentMethod?.hasCard && paymentMethod.card ? (
            <View style={styles.cardRow}>
              <Feather name="credit-card" size={18} color={colors.primary} />
              <Text style={[styles.cardText, { color: colors.foreground }]}>
                {paymentMethod.card.brand.toUpperCase()} ending {paymentMethod.card.last4}
              </Text>
              <Pressable onPress={openCardSetup}>
                <Text style={[styles.changeLink, { color: colors.primary }]}>Change</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[styles.addCardBtn, { borderColor: colors.primary }]}
              onPress={openCardSetup}
            >
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={[styles.addCardText, { color: colors.primary }]}>Add a card</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Confirm button */}
      <Pressable
        style={[
          styles.confirmBtn,
          {
            backgroundColor:
              amountPence > 0 && !paymentMethod?.hasCard
                ? colors.mutedForeground
                : colors.primary,
            opacity: confirming ? 0.6 : 1,
          },
        ]}
        onPress={handleConfirm}
        disabled={confirming || (amountPence > 0 && !paymentMethod?.hasCard && !loading)}
      >
        {confirming ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <Text style={[styles.confirmText, { color: colors.primaryForeground }]}>
            {amountPence > 0 ? `Confirm Hire · ${feeDisplay(amountPence)}` : "Confirm Hire — Free"}
          </Text>
        )}
      </Pressable>

      <Text style={[styles.legal, { color: colors.mutedForeground }]}>
        Secured by Stripe. By confirming you agree to BuildMatch's placement fee policy.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingTop: Platform.OS === "android" ? 12 : 0,
  },
  headerTitle: { fontSize: 17, fontFamily: "PlusJakartaSans_700Bold" },
  workerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  workerIcon: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  workerName: { fontSize: 17, fontFamily: "PlusJakartaSans_700Bold" },
  workerTrade: { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", marginTop: 2 },
  section: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", letterSpacing: 1 },
  feeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  feeLabel: { fontSize: 15, fontFamily: "PlusJakartaSans_500Medium" },
  feeAmount: { fontSize: 22, fontFamily: "PlusJakartaSans_800ExtraBold" },
  feeNote: { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", lineHeight: 18 },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardText: { flex: 1, fontSize: 15, fontFamily: "PlusJakartaSans_500Medium" },
  changeLink: { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold" },
  addCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 14,
    justifyContent: "center",
  },
  addCardText: { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold" },
  confirmBtn: {
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  confirmText: { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" },
  legal: { fontSize: 11, fontFamily: "PlusJakartaSans_400Regular", textAlign: "center" },
  successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  successEmoji: { fontSize: 36 },
  successTitle: { fontSize: 22, fontFamily: "PlusJakartaSans_700Bold" },
  successSub: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", textAlign: "center", lineHeight: 21 },
  doneBtn: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, marginTop: 8 },
  doneBtnText: { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" },
});

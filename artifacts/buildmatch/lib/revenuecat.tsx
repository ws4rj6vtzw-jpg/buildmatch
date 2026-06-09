import Purchases, { LOG_LEVEL } from "react-native-purchases";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { api } from "./api";

export const RC_ENTITLEMENT = "BuildMatch Pro";

// Package identifiers (must match RevenueCat dashboard)
const WORKER_PACKAGE_ID = "$rc_monthly";
export const BUILDER_BASIC_PACKAGE_ID = "buildmatch_builder_basic";
export const BUILDER_PRO_PACKAGE_ID = "buildmatch_builder_pro";
export const BUILDER_ELITE_PACKAGE_ID = "buildmatch_builder_elite";

// Store product identifiers — used to detect active tier
const BASIC_PRODUCT = "buildmatch_builder_basic_monthly";
const PRO_PRODUCT = "buildmatch_builder_pro_monthly";
const ELITE_PRODUCT = "buildmatch_builder_elite_monthly";

export type BuilderTier = "none" | "basic" | "pro" | "elite";

// Public SDK keys — safe to commit (EXPO_PUBLIC_ = intentionally client-facing)
const RC_KEY_IOS = "appl_WSDfkTfVGrEkQNAVAfWDnyujbSy";
const RC_KEY_ANDROID = "goog_jnCqdlxFCpViUbTIHiecXKOFhpB";
const RC_KEY_TEST = "test_iEMJeiyqjrcBmTDBalrhZvaxiEC";

export function initializeRevenueCat() {
  const apiKey = Platform.select({
    ios: RC_KEY_IOS,
    android: RC_KEY_ANDROID,
    default: RC_KEY_TEST,
  });

  if (!apiKey) return;

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey });
}

type SubscriptionState = {
  isPro: boolean;
  builderTier: BuilderTier;
  isLoading: boolean;
  purchaseWorkerPro: () => Promise<void>;
  purchaseBuilderBasic: () => Promise<void>;
  purchaseBuilderPro: () => Promise<void>;
  purchaseBuilderElite: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  redeemPromoCode: (code: string) => Promise<{ error?: string }>;
};

const SubscriptionContext = createContext<SubscriptionState>({
  isPro: false,
  builderTier: "none",
  isLoading: true,
  purchaseWorkerPro: async () => {},
  purchaseBuilderBasic: async () => {},
  purchaseBuilderPro: async () => {},
  purchaseBuilderElite: async () => {},
  restorePurchases: async () => {},
  redeemPromoCode: async () => ({}),
});

type OnProChange = (isPro: boolean) => void;

function detectBuilderTier(activeSubscriptions: Set<string>): BuilderTier {
  if (activeSubscriptions.has(ELITE_PRODUCT)) return "elite";
  if (activeSubscriptions.has(PRO_PRODUCT)) return "pro";
  if (activeSubscriptions.has(BASIC_PRODUCT)) return "basic";
  return "none";
}

export function SubscriptionProvider({
  children,
  onProChange,
}: {
  children: React.ReactNode;
  onProChange?: OnProChange;
}) {
  const [isPro, setIsPro] = useState(false);
  const [builderTier, setBuilderTier] = useState<BuilderTier>("none");
  const [isLoading, setIsLoading] = useState(true);

  const setProWithCallback = useCallback(
    (value: boolean) => {
      setIsPro(value);
      onProChange?.(value);
    },
    [onProChange],
  );

  useEffect(() => {
    checkSubscription();
  }, []);

  async function checkSubscription() {
    try {
      const info = await Purchases.getCustomerInfo();
      const rcActive = info.entitlements.active[RC_ENTITLEMENT] != null;

      const { data: promoData } = await api.getPromoStatus();
      const promoActive = promoData?.hasPromo ?? false;

      setProWithCallback(rcActive || promoActive);
      setBuilderTier(detectBuilderTier(info.activeSubscriptions));
    } catch {
      // not fatal
    } finally {
      setIsLoading(false);
    }
  }

  const purchasePackageById = useCallback(
    async (packageId: string): Promise<boolean> => {
      try {
        // Safety-net: re-run configure before every purchase in case
        // module-level init was skipped (embedded bundle without baked keys)
        initializeRevenueCat();
        const offerings = await Purchases.getOfferings();
        const offering = offerings.current;
        if (!offering) throw new Error("No offering available");
        const pkg = offering.availablePackages.find(
          (p) => p.identifier === packageId,
        );
        if (!pkg) throw new Error(`Package ${packageId} not found`);
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        const active = customerInfo.entitlements.active[RC_ENTITLEMENT] != null;
        setProWithCallback(active);
        setBuilderTier(detectBuilderTier(customerInfo.activeSubscriptions));
        return active;
      } catch (e: any) {
        if (!e.userCancelled) {
          Alert.alert(
            "Purchase failed",
            e.message ?? "Something went wrong. Please try again.",
          );
        }
        return false;
      }
    },
    [setProWithCallback],
  );

  const purchaseWorkerPro = useCallback(
    () => purchasePackageById(WORKER_PACKAGE_ID).then(() => undefined),
    [purchasePackageById],
  );

  const purchaseBuilderBasic = useCallback(
    () => purchasePackageById(BUILDER_BASIC_PACKAGE_ID).then(() => undefined),
    [purchasePackageById],
  );

  const purchaseBuilderPro = useCallback(
    () => purchasePackageById(BUILDER_PRO_PACKAGE_ID).then(() => undefined),
    [purchasePackageById],
  );

  const purchaseBuilderElite = useCallback(
    () => purchasePackageById(BUILDER_ELITE_PACKAGE_ID).then(() => undefined),
    [purchasePackageById],
  );

  const restorePurchases = useCallback(async () => {
    try {
      initializeRevenueCat();
      const info = await Purchases.restorePurchases();
      const active = info.entitlements.active[RC_ENTITLEMENT] != null;
      setProWithCallback(active);
      setBuilderTier(detectBuilderTier(info.activeSubscriptions));
      if (active) {
        Alert.alert("Restored", "Your subscription has been restored.");
      } else {
        Alert.alert("No purchases found", "No active subscription to restore.");
      }
    } catch (e: any) {
      Alert.alert("Restore failed", e.message ?? "Something went wrong.");
    }
  }, [setProWithCallback]);

  const redeemPromoCode = useCallback(
    async (code: string): Promise<{ error?: string }> => {
      const { data, error } = await api.redeemPromo(code);
      if (error) return { error };
      if (data?.success) {
        setProWithCallback(true);
      }
      return {};
    },
    [setProWithCallback],
  );

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        builderTier,
        isLoading,
        purchaseWorkerPro,
        purchaseBuilderBasic,
        purchaseBuilderPro,
        purchaseBuilderElite,
        restorePurchases,
        redeemPromoCode,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}

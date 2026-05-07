import Purchases, { LOG_LEVEL } from "react-native-purchases";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export const RC_ENTITLEMENT = "BuildMatch Pro";
const WORKER_PACKAGE_ID = "$rc_monthly";
const BUILDER_PACKAGE_ID = "$rc_annual";

export function initializeRevenueCat() {
  const apiKey = Platform.select({
    ios:
      process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ??
      process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY ??
      "",
    android:
      process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ??
      process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY ??
      "",
    default: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY ?? "",
  });

  if (!apiKey) return;

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey });
}

type SubscriptionState = {
  isPro: boolean;
  isLoading: boolean;
  purchaseWorkerPro: () => Promise<void>;
  purchaseBuilderPro: () => Promise<void>;
  restorePurchases: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionState>({
  isPro: false,
  isLoading: true,
  purchaseWorkerPro: async () => {},
  purchaseBuilderPro: async () => {},
  restorePurchases: async () => {},
});

type OnProChange = (isPro: boolean) => void;

export function SubscriptionProvider({
  children,
  onProChange,
}: {
  children: React.ReactNode;
  onProChange?: OnProChange;
}) {
  const [isPro, setIsPro] = useState(false);
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
      const active = info.entitlements.active[RC_ENTITLEMENT] != null;
      setProWithCallback(active);
    } catch {
      // not fatal — may fail in simulator without a configured store
    } finally {
      setIsLoading(false);
    }
  }

  const purchasePackageById = useCallback(
    async (packageId: string) => {
      try {
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
      } catch (e: any) {
        if (!e.userCancelled) {
          Alert.alert(
            "Purchase failed",
            e.message ?? "Something went wrong. Please try again.",
          );
        }
      }
    },
    [setProWithCallback],
  );

  const purchaseWorkerPro = useCallback(
    () => purchasePackageById(WORKER_PACKAGE_ID),
    [purchasePackageById],
  );

  const purchaseBuilderPro = useCallback(
    () => purchasePackageById(BUILDER_PACKAGE_ID),
    [purchasePackageById],
  );

  const restorePurchases = useCallback(async () => {
    try {
      const info = await Purchases.restorePurchases();
      const active = info.entitlements.active[RC_ENTITLEMENT] != null;
      setProWithCallback(active);
      if (active) {
        Alert.alert("Restored", "Your Pro subscription has been restored.");
      } else {
        Alert.alert("No purchases found", "No active subscription to restore.");
      }
    } catch (e: any) {
      Alert.alert("Restore failed", e.message ?? "Something went wrong.");
    }
  }, [setProWithCallback]);

  return (
    <SubscriptionContext.Provider
      value={{ isPro, isLoading, purchaseWorkerPro, purchaseBuilderPro, restorePurchases }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}

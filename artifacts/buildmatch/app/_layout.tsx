import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Notifier } from "@/components/Notifier";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { api } from "@/lib/api";
import { initializeRevenueCat, SubscriptionProvider } from "@/lib/revenuecat";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

SplashScreen.preventAutoHideAsync();
initializeRevenueCat();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back", headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="job" />
      <Stack.Screen name="worker" />
      <Stack.Screen name="post-job" options={{ presentation: "modal" }} />
      <Stack.Screen name="documents" />
      <Stack.Screen name="welcome-back" />
    </Stack>
  );
}

function SubscriptionBridge({ children }: { children: React.ReactNode }) {
  const { updateProfile } = useAuth();

  const onProChange = useCallback(
    (isPro: boolean) => {
      updateProfile({ isPro });
    },
    [updateProfile],
  );

  return (
    <SubscriptionProvider onProChange={onProChange}>
      {children}
    </SubscriptionProvider>
  );
}

async function registerForPushNotifications(): Promise<string | null> {
  try {
    if (!Device.isDevice) return null;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "BuildMatch",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#F59E0B",
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return null;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "c675e172-afb6-48f4-b860-d1026e5ad61a",
    });
    return tokenData.data;
  } catch {
    return null;
  }
}

function UpdateBridge({ children }: { children: React.ReactNode }) {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const checking = useRef(false);

  useEffect(() => {
    if (!Updates.isEnabled) return;

    async function checkForUpdate() {
      if (checking.current) return;
      checking.current = true;
      try {
        const result = await Updates.checkForUpdateAsync();
        if (result.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch {
        // silently ignore — network errors, dev builds, etc.
      } finally {
        checking.current = false;
      }
    }

    // Check on mount so a fresh install picks up OTA immediately
    checkForUpdate();

    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === "active") {
        checkForUpdate();
      }
      appState.current = next;
    });

    return () => sub.remove();
  }, []);

  return <>{children}</>;
}

function PushBridge({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const registeredForRef = useRef<string | null>(null);
  const notificationListener = useRef<ReturnType<typeof Notifications.addNotificationReceivedListener> | null>(null);
  const responseListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);

  useEffect(() => {
    if (!user?.id || registeredForRef.current === user.id) return;
    registeredForRef.current = user.id;

    registerForPushNotifications().then((pushToken) => {
      if (pushToken) {
        api.registerPushToken(pushToken).catch(() => {});
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // Foreground notifications are handled by the system banner
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      // Handle tap on notification — app already open, just go to matches
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [user?.id]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <ThemeProvider>
                <UpdateBridge>
                <AuthProvider>
                  <PushBridge>
                    <DataProvider>
                      <SubscriptionBridge>
                        <NotificationProvider>
                          <StatusBar style="auto" />
                          <RootLayoutNav />
                          <Notifier />
                        </NotificationProvider>
                      </SubscriptionBridge>
                    </DataProvider>
                  </PushBridge>
                </AuthProvider>
                </UpdateBridge>
              </ThemeProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

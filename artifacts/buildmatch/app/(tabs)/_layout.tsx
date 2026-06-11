import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Badge, Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { useData } from "@/contexts/DataContext";

function NativeTabLayout() {
  const { totalUnread } = useData();
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="discover">
        <Icon sf={{ default: "flame", selected: "flame.fill" }} />
        <Label>Discover</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="jobs">
        <Icon sf={{ default: "briefcase", selected: "briefcase.fill" }} />
        <Label>Jobs</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="matches">
        <Icon sf={{ default: "message", selected: "message.fill" }} />
        <Label>Matches</Label>
        {totalUnread > 0 ? (
          <Badge>{totalUnread > 99 ? "99+" : String(totalUnread)}</Badge>
        ) : null}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const { totalUnread } = useData();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "PlusJakartaSans_600SemiBold",
          fontSize: 11,
        },
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? colors.surface + "CC" : colors.surface,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={80}
              tint="systemMaterialDark"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.surface }]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => <Feather name="zap" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color }) => (
            <Feather name="briefcase" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarIcon: ({ color }) => (
            <Feather name="message-circle" size={22} color={color} />
          ),
          tabBarBadge:
            totalUnread > 0 ? (totalUnread > 99 ? "99+" : totalUnread) : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.primaryForeground,
            fontSize: 10,
            fontFamily: "PlusJakartaSans_700Bold",
            minWidth: 18,
            height: 18,
            lineHeight: 14,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  // Liquid glass (NativeTabs) is available on iOS 26+.
  // We intentionally avoid importing expo-glass-effect here because its iOS
  // entry calls requireNativeViewManager at module level, which crashes on
  // devices that don't support the ExpoGlassEffect native view manager.
  const useLiquidGlass =
    Platform.OS === "ios" &&
    typeof Platform.Version === "string"
      ? parseInt(Platform.Version, 10) >= 26
      : (Platform.Version as number) >= 26;

  if (useLiquidGlass) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}

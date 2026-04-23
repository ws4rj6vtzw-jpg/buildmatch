import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { useColors } from "@/hooks/useColors";

export type Notification = {
  id: string;
  title: string;
  body: string;
  icon?: keyof typeof Feather.glyphMap;
  photo?: string;
  initials?: string;
  href?: string;
  tone?: "primary" | "default";
};

type Ctx = {
  notify: (n: Omit<Notification, "id">) => void;
};

const NotificationContext = createContext<Ctx | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<Notification | null>(null);
  const queue = useRef<Notification[]>([]);
  const translateY = useRef(new Animated.Value(-140)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNext = useCallback(() => {
    const next = queue.current.shift();
    if (!next) {
      setCurrent(null);
      return;
    }
    setCurrent(next);
  }, []);

  const dismiss = useCallback(() => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -140,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      showNext();
    });
  }, [opacity, showNext, translateY]);

  useEffect(() => {
    if (!current) return;
    translateY.setValue(-140);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 16,
        stiffness: 180,
        mass: 0.9,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => undefined,
      );
    }
    dismissTimer.current = setTimeout(() => dismiss(), 3800);
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [current, dismiss, opacity, translateY]);

  const notify = useCallback<Ctx["notify"]>((n) => {
    const item: Notification = { ...n, id: `${Date.now()}-${Math.random()}` };
    if (!current && queue.current.length === 0) {
      queue.current.push(item);
      // Trigger via state set — using showNext directly would race
      setCurrent(item);
      queue.current.shift();
    } else {
      queue.current.push(item);
    }
  }, [current]);

  const handlePress = () => {
    if (!current?.href) return;
    const href = current.href;
    dismiss();
    setTimeout(() => router.push(href as never), 100);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {current && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.wrap,
            {
              top: insets.top + 8,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
              styles.banner,
              {
                backgroundColor: colors.elevated,
                borderColor: colors.border,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            {current.photo || current.initials ? (
              <Avatar uri={current.photo} name={current.initials ?? "?"} size={40} />
            ) : (
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor:
                      current.tone === "primary" ? colors.primary : colors.card,
                  },
                ]}
              >
                <Feather
                  name={current.icon ?? "bell"}
                  size={20}
                  color={
                    current.tone === "primary"
                      ? colors.primaryForeground
                      : colors.foreground
                  }
                />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
                {current.title}
              </Text>
              <Text
                style={[styles.body, { color: colors.mutedForeground }]}
                numberOfLines={2}
              >
                {current.body}
              </Text>
            </View>
            <Pressable onPress={dismiss} hitSlop={10} style={styles.close}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          </Pressable>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotify must be used inside NotificationProvider");
  return ctx.notify;
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 12,
    right: 12,
    zIndex: 1000,
    elevation: 1000,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
  close: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

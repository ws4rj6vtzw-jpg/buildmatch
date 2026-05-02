import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

const { width: SCREEN_W } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

export type SwipeCardData = {
  id: string;
  title: string;
  subtitle: string;
  meta?: string;
  photo?: string;
  badges?: { label: string; tone?: "default" | "primary" | "accent" }[];
  rating?: number;
  jobCount?: number;
  description?: string;
  rightChips?: string[];
};

type Props = {
  data: SwipeCardData;
  isTop: boolean;
  onSwipe: (direction: "left" | "right") => void;
  onTap?: () => void;
  stackOffset?: number;
  rightLabel?: string;
};

export function SwipeCard({ data, isTop, onSwipe, onTap, stackOffset = 0, rightLabel = "MATCH" }: Props) {
  const colors = useColors();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onMoveShouldSetPanResponder: (_, g) =>
        isTop && (Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6),
      onPanResponderMove: Animated.event(
        [null, { dx: translateX, dy: translateY }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: SCREEN_W * 1.4,
            duration: 220,
            useNativeDriver: true,
          }).start(() => onSwipe("right"));
        } else if (g.dx < -SWIPE_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: -SCREEN_W * 1.4,
            duration: 220,
            useNativeDriver: true,
          }).start(() => onSwipe("left"));
        } else {
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          ]).start();
        }
      },
    }),
  ).current;

  const rotate = translateX.interpolate({
    inputRange: [-SCREEN_W, 0, SCREEN_W],
    outputRange: ["-12deg", "0deg", "12deg"],
  });

  const likeOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const nopeOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: 24,
          transform: [
            { translateX },
            { translateY },
            { rotate },
            { scale: 1 - stackOffset * 0.04 },
            { translateY: stackOffset * 12 },
          ],
          zIndex: 100 - stackOffset,
        },
      ]}
    >
      <Pressable onPress={onTap} style={StyleSheet.absoluteFill}>
        {data.photo ? (
          <Image source={{ uri: data.photo }} style={styles.photo} contentFit="cover" />
        ) : (
          <View style={[styles.photo, { backgroundColor: colors.elevated }]} />
        )}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.92)"]}
          locations={[0.4, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View
          style={[
            styles.stamp,
            styles.stampLike,
            { borderColor: colors.primary, opacity: likeOpacity },
          ]}
        >
          <Text style={[styles.stampText, { color: colors.primary }]}>{rightLabel}</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.stamp,
            styles.stampNope,
            { borderColor: colors.mutedForeground, opacity: nopeOpacity },
          ]}
        >
          <Text style={[styles.stampText, { color: colors.mutedForeground }]}>PASS</Text>
        </Animated.View>

        <View style={styles.content}>
          {data.badges && data.badges.length > 0 && (
            <View style={styles.badgeRow}>
              {data.badges.map((b, i) => (
                <View
                  key={i}
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        b.tone === "primary"
                          ? colors.primary
                          : b.tone === "accent"
                          ? colors.accent
                          : "rgba(255,255,255,0.18)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color:
                          b.tone === "primary" || b.tone === "accent"
                            ? colors.primaryForeground
                            : "#fff",
                      },
                    ]}
                  >
                    {b.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.title} numberOfLines={2}>
            {data.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {data.subtitle}
          </Text>

          <View style={styles.metaRow}>
            {typeof data.rating === "number" && data.rating > 0 && (
              <View style={styles.metaChip}>
                <Feather name="star" size={12} color={colors.primary} />
                <Text style={styles.metaText}>
                  {data.rating.toFixed(1)}
                  {typeof data.jobCount === "number" && data.jobCount > 0
                    ? `  ·  ${data.jobCount} jobs`
                    : ""}
                </Text>
              </View>
            )}
            {data.meta && (
              <View style={styles.metaChip}>
                <Feather name="map-pin" size={12} color="#fff" />
                <Text style={styles.metaText}>{data.meta}</Text>
              </View>
            )}
          </View>

          {data.description && (
            <Text style={styles.description} numberOfLines={2}>
              {data.description}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 26,
    gap: 8,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "SpaceGrotesk_600SemiBold",
    letterSpacing: 0.3,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "SpaceGrotesk_700Bold",
    letterSpacing: -0.4,
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontFamily: "SpaceGrotesk_500Medium",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  metaText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "SpaceGrotesk_500Medium",
  },
  description: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: "SpaceGrotesk_400Regular",
    marginTop: 6,
    lineHeight: 18,
  },
  stamp: {
    position: "absolute",
    top: 56,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 4,
    borderRadius: 12,
  },
  stampLike: {
    right: 24,
    transform: [{ rotate: "12deg" }],
  },
  stampNope: {
    left: 24,
    transform: [{ rotate: "-12deg" }],
  },
  stampText: {
    fontSize: 28,
    fontFamily: "SpaceGrotesk_700Bold",
    letterSpacing: 2,
  },
});

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type Props = {
  uri?: string;
  name?: string;
  size?: number;
};

export function Avatar({ uri, name, size = 48 }: Props) {
  const colors = useColors();
  const initials = (name ?? "")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const radius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radius, backgroundColor: colors.elevated }}
        contentFit="cover"
      />
    );
  }
  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.elevated,
        },
      ]}
    >
      {initials ? (
        <Text style={[styles.text, { color: colors.foreground, fontSize: size * 0.36 }]}>
          {initials}
        </Text>
      ) : (
        <Feather name="user" size={size * 0.5} color={colors.mutedForeground} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
});

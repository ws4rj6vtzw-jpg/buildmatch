import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: "default" | "primary" | "outline";
};

export function Pill({ label, selected, onPress, variant = "default" }: Props) {
  const colors = useColors();
  const isPrimary = variant === "primary" || selected;
  const bg = isPrimary
    ? colors.primary
    : variant === "outline"
    ? "transparent"
    : colors.secondary;
  const fg = isPrimary
    ? colors.primaryForeground
    : variant === "outline"
    ? colors.foreground
    : colors.foreground;
  const borderColor = variant === "outline" ? colors.border : "transparent";

  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={({ pressed }: { pressed?: boolean } = {}) => [
        styles.pill,
        { backgroundColor: bg, borderColor, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 13,
    fontFamily: "SpaceGrotesk_500Medium",
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

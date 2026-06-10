import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
];

type Props = {
  value: string;
  maxLength?: number;
  onChange: (v: string) => void;
};

export function PinPad({ value, maxLength = 4, onChange }: Props) {
  const colors = useColors();

  const press = (k: string) => {
    if (k === "⌫") {
      onChange(value.slice(0, -1));
    } else if (k !== "" && value.length < maxLength) {
      onChange(value + k);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.dots}>
        {Array.from({ length: maxLength }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i < value.length ? colors.primary : "transparent",
                borderColor: i < value.length ? colors.primary : colors.border,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.grid}>
        {ROWS.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((k, ci) => (
              <Pressable
                key={ci}
                onPress={() => press(k)}
                disabled={k === ""}
                style={({ pressed }) => [
                  styles.key,
                  {
                    backgroundColor:
                      k === "" ? "transparent" : pressed ? colors.card : colors.elevated,
                    borderColor: k === "" ? "transparent" : colors.border,
                    borderWidth: k === "" ? 0 : 1,
                    opacity: k === "" ? 0 : 1,
                  },
                ]}
              >
                {k === "⌫" ? (
                  <Feather name="delete" size={22} color={colors.foreground} />
                ) : (
                  <Text style={[styles.keyText, { color: colors.foreground }]}>{k}</Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 36 },
  dots: { flexDirection: "row", gap: 20 },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  grid: { gap: 12 },
  row: { flexDirection: "row", gap: 12 },
  key: {
    width: 88,
    height: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
});

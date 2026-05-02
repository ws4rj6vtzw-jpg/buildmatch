import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";

type Props = {
  visible: boolean;
  partnerName: string;
  jobTitle?: string;
  onClose: () => void;
  onSubmit: (stars: number, comment: string) => void;
};

export function RatingModal({
  visible,
  partnerName,
  jobTitle,
  onClose,
  onSubmit,
}: Props) {
  const colors = useColors();
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");

  const reset = () => {
    setStars(0);
    setComment("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = () => {
    if (stars === 0) return;
    onSubmit(stars, comment.trim());
    reset();
  };

  const setStar = (n: number) => {
    setStars(n);
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => undefined);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <Pressable style={styles.bg} onPress={close}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
            <Feather name="check" size={28} color={colors.primaryForeground} />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            Job complete
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            How was working with {partnerName}?
          </Text>
          {jobTitle ? (
            <Text style={[styles.job, { color: colors.primary }]} numberOfLines={1}>
              {jobTitle}
            </Text>
          ) : null}

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                onPress={() => setStar(n)}
                style={({ pressed }) => [
                  styles.starBtn,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
                hitSlop={8}
              >
                <Feather
                  name="star"
                  size={36}
                  color={n <= stars ? colors.primary : colors.mutedForeground}
                  style={n <= stars ? styles.starFilled : undefined}
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Optional feedback..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={240}
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.elevated,
                borderColor: colors.border,
              },
            ]}
          />

          <View style={{ height: 8 }} />
          <PrimaryButton
            label="Submit rating"
            onPress={submit}
            disabled={stars === 0}
          />
          <Pressable onPress={close} style={{ marginTop: 14 }}>
            <Text style={[styles.skip, { color: colors.mutedForeground }]}>
              Skip for now
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    padding: 26,
    alignItems: "center",
    gap: 6,
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: "SpaceGrotesk_700Bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk_400Regular",
    textAlign: "center",
  },
  job: {
    fontSize: 13,
    fontFamily: "SpaceGrotesk_600SemiBold",
    marginTop: 4,
  },
  starsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 18,
    marginBottom: 14,
  },
  starBtn: {
    padding: 4,
  },
  starFilled: {
    textShadowColor: "rgba(255,184,0,0.6)",
    textShadowRadius: 6,
  },
  input: {
    alignSelf: "stretch",
    minHeight: 70,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: "SpaceGrotesk_400Regular",
    textAlignVertical: "top",
    marginTop: 4,
  },
  skip: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk_500Medium",
  },
});

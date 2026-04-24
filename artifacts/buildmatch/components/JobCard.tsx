import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { Job } from "@/types";

type Props = {
  job: Job;
  builderName?: string;
  onPress?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
};

export function JobCard({ job, builderName, onPress, saved, onToggleSave }: Props) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.tradeChip, { backgroundColor: colors.primary }]}>
          <Text style={[styles.tradeText, { color: colors.primaryForeground }]}>
            {job.trade}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.rate, { color: colors.foreground }]}>
            £{job.payRate}
            <Text style={[styles.rateUnit, { color: colors.mutedForeground }]}>
              /{job.payType === "hour" ? "hr" : "day"}
            </Text>
          </Text>
          {onToggleSave ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              hitSlop={10}
              style={({ pressed }) => [
                styles.saveBtn,
                {
                  backgroundColor: saved ? colors.primary : colors.secondary,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Feather
                name="bookmark"
                size={16}
                color={saved ? colors.primaryForeground : colors.foreground}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
        {job.title}
      </Text>

      {builderName && (
        <Text style={[styles.builder, { color: colors.mutedForeground }]}>
          {builderName}
        </Text>
      )}

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="map-pin" size={13} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {job.suburb}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="calendar" size={13} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {job.startDate}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="clock" size={13} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {job.durationDays} {job.durationDays === 1 ? "day" : "days"}
          </Text>
        </View>
      </View>

      {job.requiredTickets.length > 0 && (
        <View style={styles.ticketsRow}>
          {job.requiredTickets.slice(0, 3).map((t) => (
            <View
              key={t}
              style={[styles.ticket, { backgroundColor: colors.secondary }]}
            >
              <Text style={[styles.ticketText, { color: colors.foreground }]}>
                {t}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  saveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tradeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  tradeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  rate: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  rateUnit: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  builder: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  ticketsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  ticket: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ticketText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});

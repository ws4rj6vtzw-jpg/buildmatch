import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TICKETS, TRADES } from "@/constants/trades";
import { useColors } from "@/hooks/useColors";
import { useData } from "@/contexts/DataContext";

export default function PostJob() {
  const colors = useColors();
  const { postJob } = useData();

  const [title, setTitle] = useState("");
  const [trade, setTrade] = useState("");
  const [suburb, setSuburb] = useState("");
  const [postcode, setPostcode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [payRate, setPayRate] = useState("");
  const [payType, setPayType] = useState<"hour" | "day">("hour");
  const [tickets, setTickets] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const valid =
    title && trade && suburb && startDate && duration && payRate && description;

  const onPost = () => {
    postJob({
      title,
      trade,
      suburb,
      postcode,
      startDate,
      durationDays: Number(duration) || 1,
      payRate: Number(payRate) || 0,
      payType,
      requiredTickets: tickets,
      description,
    });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Post a job",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Field label="Job title">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Second-fix carpenter — cafe fit-out"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
            />
          </Field>

          <Field label="Trade">
            <View style={styles.pills}>
              {TRADES.map((t) => (
                <Pill key={t} label={t} selected={trade === t} onPress={() => setTrade(t)} />
              ))}
            </View>
          </Field>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 2 }}>
              <Field label="Suburb">
                <TextInput
                  value={suburb}
                  onChangeText={setSuburb}
                  placeholder="Shoreditch"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
                />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Postcode">
                <TextInput
                  value={postcode}
                  onChangeText={(v) => setPostcode(v.toUpperCase().slice(0, 8))}
                  placeholder="E1 6RF"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="characters"
                  style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
                />
              </Field>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Field label="Start date">
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="Mon 5 May"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
                />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Duration (days)">
                <TextInput
                  value={duration}
                  onChangeText={(v) => setDuration(v.replace(/\D/g, ""))}
                  placeholder="5"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
                />
              </Field>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-end" }}>
            <View style={{ flex: 1 }}>
              <Field label="Pay rate (£)">
                <TextInput
                  value={payRate}
                  onChangeText={(v) => setPayRate(v.replace(/\D/g, ""))}
                  placeholder="80"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
                />
              </Field>
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Per</Text>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <Pill label="Hour" selected={payType === "hour"} onPress={() => setPayType("hour")} />
                <Pill label="Day" selected={payType === "day"} onPress={() => setPayType("day")} />
              </View>
            </View>
          </View>

          <Field label="Required tickets">
            <View style={styles.pills}>
              {TICKETS.map((t) => (
                <Pill
                  key={t}
                  label={t}
                  selected={tickets.includes(t)}
                  onPress={() =>
                    setTickets((cur) =>
                      cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t],
                    )
                  }
                />
              ))}
            </View>
          </Field>

          <Field label="Description">
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              scrollEnabled={false}
              placeholder="Scope of work, site conditions, parking, anything a worker needs to know."
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.input,
                styles.multiline,
                { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border },
              ]}
            />
          </Field>

          <View style={{ height: 8 }} />
          <PrimaryButton label="Post job" onPress={onPost} disabled={!valid} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={{ gap: 8 }}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: Platform.OS === "web" ? 80 : 40,
    gap: 16,
  },
  label: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  multiline: { minHeight: 110, textAlignVertical: "top" },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});

import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TICKETS, TRADES } from "@/constants/trades";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileSetupScreen() {
  const colors = useColors();
  const { user, updateProfile } = useAuth();
  const isWorker = user?.role === "worker";

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [companyName, setCompanyName] = useState(user?.companyName ?? "");
  const [contactName, setContactName] = useState(user?.contactName ?? "");
  const [primaryTrade, setPrimaryTrade] = useState<string>(user?.primaryTrade ?? "");
  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [tickets, setTickets] = useState<string[]>(user?.tickets ?? []);
  const [tradesNeeded, setTradesNeeded] = useState<string[]>([]);
  const [years, setYears] = useState<string>(user?.yearsExperience?.toString() ?? "");
  const [suburb, setSuburb] = useState(user?.suburb ?? "");
  const [postcode, setPostcode] = useState(user?.postcode ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [publicLiabilityInsured, setPublicLiabilityInsured] = useState(user?.publicLiabilityInsured ?? false);
  const [insurerName, setInsurerName] = useState(user?.insurerName ?? "");

  const toggle = (
    list: string[],
    set: (next: string[]) => void,
    item: string,
  ) => {
    set(list.includes(item) ? list.filter((s) => s !== item) : [...list, item]);
  };

  const valid = isWorker
    ? !!(fullName && primaryTrade && suburb)
    : !!(companyName && contactName && suburb);

  const onSave = async () => {
    if (isWorker) {
      await updateProfile({
        fullName,
        primaryTrade,
        skills: skills.length ? skills : [primaryTrade],
        tickets,
        yearsExperience: Number(years) || 0,
        suburb,
        postcode,
        bio,
        availableNow: true,
        publicLiabilityInsured,
        insurerName: publicLiabilityInsured ? insurerName : "",
      });
    } else {
      await updateProfile({
        companyName,
        contactName,
        suburb,
        postcode,
        bio,
        skills: tradesNeeded,
      });
    }
    router.replace("/(tabs)/discover");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          {isWorker ? "Tell us about you" : "Set up your company"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {isWorker
            ? "Builders see this when they swipe. Be honest, be specific."
            : "Workers see this when you post or browse. Keep it real."}
        </Text>

        {isWorker ? (
          <Field label="Full name">
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Jamie O'Brien"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
            />
          </Field>
        ) : (
          <>
            <Field label="Company name">
              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="e.g. Sandstone Builders"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
              />
            </Field>
            <Field label="Your name">
              <TextInput
                value={contactName}
                onChangeText={setContactName}
                placeholder="e.g. Sam Patel"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
              />
            </Field>
          </>
        )}

        {isWorker && (
          <>
            <Field label="Primary trade">
              <View style={styles.pillsWrap}>
                {TRADES.map((t) => (
                  <Pill
                    key={t}
                    label={t}
                    selected={primaryTrade === t}
                    onPress={() => setPrimaryTrade(t)}
                  />
                ))}
              </View>
            </Field>

            <Field label="Other skills">
              <View style={styles.pillsWrap}>
                {TRADES.filter((t) => t !== primaryTrade).map((t) => (
                  <Pill
                    key={t}
                    label={t}
                    selected={skills.includes(t)}
                    onPress={() => toggle(skills, setSkills, t)}
                  />
                ))}
              </View>
            </Field>

            <Field label="Tickets & licences">
              <View style={styles.pillsWrap}>
                {TICKETS.map((t) => (
                  <Pill
                    key={t}
                    label={t}
                    selected={tickets.includes(t)}
                    onPress={() => toggle(tickets, setTickets, t)}
                  />
                ))}
              </View>
            </Field>

            <Field label="Public liability insurance">
              <View style={[styles.insuranceRow, { backgroundColor: colors.card, borderColor: publicLiabilityInsured ? colors.primary : colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.insuranceTitle, { color: colors.foreground }]}>
                    I hold PLI cover
                  </Text>
                  <Text style={[styles.insuranceSub, { color: colors.mutedForeground }]}>
                    Required for most commercial sites
                  </Text>
                </View>
                <Switch
                  value={publicLiabilityInsured}
                  onValueChange={setPublicLiabilityInsured}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.primaryForeground}
                />
              </View>
              {publicLiabilityInsured && (
                <TextInput
                  value={insurerName}
                  onChangeText={setInsurerName}
                  placeholder="Insurer name (e.g. AXA, Hiscox)"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border, marginTop: 8 }]}
                />
              )}
            </Field>

            <Field label="Years of experience">
              <TextInput
                value={years}
                onChangeText={(v) => setYears(v.replace(/\D/g, ""))}
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="number-pad"
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
              />
            </Field>
          </>
        )}

        {!isWorker && (
          <Field label="Trades you typically hire">
            <View style={styles.pillsWrap}>
              {TRADES.map((t) => (
                <Pill
                  key={t}
                  label={t}
                  selected={tradesNeeded.includes(t)}
                  onPress={() => toggle(tradesNeeded, setTradesNeeded, t)}
                />
              ))}
            </View>
          </Field>
        )}

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 2 }}>
            <Field label="Suburb">
              <TextInput
                value={suburb}
                onChangeText={setSuburb}
                placeholder="Surry Hills"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
              />
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Postcode">
              <TextInput
                value={postcode}
                onChangeText={(v) => setPostcode(v.replace(/\D/g, "").slice(0, 4))}
                placeholder="2010"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="number-pad"
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
              />
            </Field>
          </View>
        </View>

        <Field label="Short bio">
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder={isWorker ? "What do you specialise in?" : "What kind of work do you run?"}
            placeholderTextColor={colors.mutedForeground}
            multiline
            style={[
              styles.input,
              styles.multiline,
              { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border },
            ]}
          />
        </Field>

        <View style={{ height: 12 }} />
        <PrimaryButton label="Finish setup" onPress={onSave} disabled={!valid} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
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
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    padding: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === "web" ? 80 : 40,
    gap: 18,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  multiline: { minHeight: 92, textAlignVertical: "top" },
  pillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  insuranceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  insuranceTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  insuranceSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
});

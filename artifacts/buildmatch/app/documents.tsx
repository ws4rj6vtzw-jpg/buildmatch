import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";
import type { UploadedDocument } from "@/types";

const TICKET_CATEGORIES = [
  "CSCS Card",
  "IPAF (Powered Access)",
  "PASMA (Mobile Access)",
  "First Aid Certificate",
  "Asbestos Awareness",
  "Manual Handling",
  "COSHH",
  "Confined Spaces",
  "Working at Height",
  "Abrasive Wheels",
];

const INSURANCE_CATEGORIES = [
  "Public Liability Insurance",
  "Employers Liability",
  "Professional Indemnity",
];

function newId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 8);
}

export default function DocumentsScreen() {
  const colors = useColors();
  const { user, updateProfile } = useAuth();
  const [deleting, setDeleting] = useState<string | null>(null);

  if (!user) return null;

  const docs: UploadedDocument[] = user.documents ?? [];
  const ticketDocs = docs.filter((d) => d.section === "ticket");
  const insuranceDocs = docs.filter((d) => d.section === "insurance");

  const uploadDoc = async (category: string, section: "ticket" | "insurance") => {
    const existing = docs.find((d) => d.category === category);
    if (existing) {
      Alert.alert(
        "Replace document?",
        `You already have a "${category}" uploaded. Replace it?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Replace", onPress: () => pickAndSave(category, section, existing.id) },
        ],
      );
      return;
    }
    await pickAndSave(category, section, null);
  };

  const pickAndSave = async (
    category: string,
    section: "ticket" | "insurance",
    replaceId: string | null,
  ) => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow access to your photo library to upload documents.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]) return;
    const uri = result.assets[0].uri;

    const newDoc: UploadedDocument = {
      id: replaceId ?? newId(),
      category,
      section,
      uri,
      uploadedAt: Date.now(),
      verified: false,
    };

    const updated = replaceId
      ? docs.map((d) => (d.id === replaceId ? newDoc : d))
      : [...docs, newDoc];

    await updateProfile({ documents: updated });
  };

  const deleteDoc = (doc: UploadedDocument) => {
    Alert.alert(
      "Remove document",
      `Remove "${doc.category}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setDeleting(doc.id);
            await updateProfile({ documents: docs.filter((d) => d.id !== doc.id) });
            setDeleting(null);
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Documents & Verification" showBack />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info banner */}
        <View style={[styles.banner, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "44" }]}>
          <Feather name="shield" size={18} color={colors.primary} style={{ marginTop: 1 }} />
          <Text style={[styles.bannerText, { color: colors.foreground }]}>
            Upload photos of your certifications and insurance. Our team will review and verify them — verified workers get a badge on their profile.
          </Text>
        </View>

        {/* Trade Tickets & Certifications */}
        <Section
          label="Trade Tickets & Certifications"
          icon="award"
          colors={colors}
        >
          {/* Uploaded docs */}
          {ticketDocs.length > 0 && (
            <View style={styles.docGrid}>
              {ticketDocs.map((doc) => (
                <DocCard
                  key={doc.id}
                  doc={doc}
                  onDelete={() => deleteDoc(doc)}
                  onReplace={() => pickAndSave(doc.category, "ticket", doc.id)}
                  deleting={deleting === doc.id}
                  colors={colors}
                />
              ))}
            </View>
          )}

          {/* Category buttons */}
          <View style={styles.categoryList}>
            {TICKET_CATEGORIES.map((cat) => {
              const uploaded = ticketDocs.some((d) => d.category === cat);
              return (
                <CategoryRow
                  key={cat}
                  label={cat}
                  uploaded={uploaded}
                  onPress={() => uploadDoc(cat, "ticket")}
                  colors={colors}
                />
              );
            })}
          </View>
        </Section>

        {/* Insurance */}
        <Section
          label="Insurance Documents"
          icon="umbrella"
          colors={colors}
        >
          {insuranceDocs.length > 0 && (
            <View style={styles.docGrid}>
              {insuranceDocs.map((doc) => (
                <DocCard
                  key={doc.id}
                  doc={doc}
                  onDelete={() => deleteDoc(doc)}
                  onReplace={() => pickAndSave(doc.category, "insurance", doc.id)}
                  deleting={deleting === doc.id}
                  colors={colors}
                />
              ))}
            </View>
          )}

          <View style={styles.categoryList}>
            {INSURANCE_CATEGORIES.map((cat) => {
              const uploaded = insuranceDocs.some((d) => d.category === cat);
              return (
                <CategoryRow
                  key={cat}
                  label={cat}
                  uploaded={uploaded}
                  onPress={() => uploadDoc(cat, "insurance")}
                  colors={colors}
                />
              );
            })}
          </View>
        </Section>

        {/* Summary */}
        {docs.length > 0 && (
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.summaryRow}>
              <Feather name="file-text" size={16} color={colors.mutedForeground} />
              <Text style={[styles.summaryText, { color: colors.mutedForeground }]}>
                {docs.length} document{docs.length !== 1 ? "s" : ""} uploaded · Pending review
              </Text>
            </View>
            <Text style={[styles.summaryHint, { color: colors.mutedForeground }]}>
              Verification usually takes 1–2 business days.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Section({
  label,
  icon,
  colors,
  children,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: colors.primary + "22" }]}>
          <Feather name={icon} size={16} color={colors.primary} />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

function CategoryRow({
  label,
  uploaded,
  onPress,
  colors,
}: {
  label: string;
  uploaded: boolean;
  onPress: () => void;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.catRow,
        { borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View
        style={[
          styles.catStatus,
          {
            backgroundColor: uploaded ? colors.primary + "22" : colors.elevated,
            borderColor: uploaded ? colors.primary + "55" : colors.border,
          },
        ]}
      >
        <Feather
          name={uploaded ? "check" : "upload"}
          size={13}
          color={uploaded ? colors.primary : colors.mutedForeground}
        />
      </View>
      <Text
        style={[
          styles.catLabel,
          { color: uploaded ? colors.foreground : colors.mutedForeground },
        ]}
      >
        {label}
      </Text>
      {uploaded ? (
        <View style={[styles.pendingBadge, { backgroundColor: colors.accent + "22", borderColor: colors.accent + "44" }]}>
          <Text style={[styles.pendingText, { color: colors.accent }]}>Pending</Text>
        </View>
      ) : (
        <Feather name="plus" size={16} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

function DocCard({
  doc,
  onDelete,
  onReplace,
  deleting,
  colors,
}: {
  doc: UploadedDocument;
  onDelete: () => void;
  onReplace: () => void;
  deleting: boolean;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  const date = new Date(doc.uploadedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={[styles.docCard, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
      <Image source={{ uri: doc.uri }} style={styles.docThumb} resizeMode="cover" />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.docName, { color: colors.foreground }]} numberOfLines={2}>
          {doc.category}
        </Text>
        <Text style={[styles.docDate, { color: colors.mutedForeground }]}>{date}</Text>
        <View style={[styles.pendingBadge, { backgroundColor: colors.accent + "22", borderColor: colors.accent + "44", alignSelf: "flex-start" }]}>
          <Feather name="clock" size={10} color={colors.accent} />
          <Text style={[styles.pendingText, { color: colors.accent }]}>Pending</Text>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <Pressable
          onPress={onReplace}
          style={({ pressed }) => [
            styles.docAction,
            { backgroundColor: colors.primary + "22", opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="refresh-cw" size={13} color={colors.primary} />
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            styles.docAction,
            { backgroundColor: colors.destructive + "22", opacity: pressed || deleting ? 0.5 : 1 },
          ]}
        >
          <Feather name="trash-2" size={13} color={colors.destructive} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: Platform.OS === "web" ? 120 : 48,
    gap: 14,
  },
  banner: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 19,
  },
  section: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.2,
  },
  categoryList: { gap: 6 },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  catStatus: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  catLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  pendingText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  docGrid: { gap: 8 },
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  docThumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  docName: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
    lineHeight: 18,
  },
  docDate: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  docAction: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  summaryHint: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    marginLeft: 24,
  },
});

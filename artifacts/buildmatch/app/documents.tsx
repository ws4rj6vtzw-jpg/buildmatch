import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { uploadToS3 } from "@/lib/uploadToS3";
import type { UploadedDocument } from "@/types";

// CSCS card colours and their levels
const CSCS_LEVELS: { colour: string; hex: string; level: string }[] = [
  { colour: "Green",    hex: "#16a34a", level: "Labourer" },
  { colour: "Red",      hex: "#dc2626", level: "Trainee / Experienced Worker" },
  { colour: "Blue",     hex: "#2563eb", level: "Skilled Worker" },
  { colour: "Gold",     hex: "#ca8a04", level: "Advanced Craft / Supervisor" },
  { colour: "Black",    hex: "#1c1917", level: "Manager" },
  { colour: "White",    hex: "#94a3b8", level: "Professionally Qualified" },
  { colour: "Platinum", hex: "#7c3aed", level: "Senior Manager" },
];

const TICKET_CATEGORIES = [
  "CSCS Card",
  "CPCS (Plant Operator)",
  "NPORS",
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
  const [uploading, setUploading] = useState<string | null>(null); // category being uploaded
  const [cscsOpen, setCscsOpen] = useState(false);

  if (!user) return null;

  const docs: UploadedDocument[] = user.documents ?? [];
  const ticketDocs = docs.filter((d) => d.section === "ticket");
  const insuranceDocs = docs.filter((d) => d.section === "insurance");
  const businessDocs = docs.filter((d) => d.section === "business");

  const uploadDoc = async (category: string, section: "ticket" | "insurance" | "business") => {
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
    section: "ticket" | "insurance" | "business",
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
    const asset = result.assets[0];
    const localUri = asset.uri;
    const filename = asset.fileName ?? `doc_${Date.now()}.jpg`;
    const contentType = asset.mimeType ?? "image/jpeg";

    setUploading(category);
    let s3Url: string | undefined;
    try {
      s3Url = await uploadToS3(localUri, { filename, contentType, folder: "documents" });
    } catch {
      // S3 upload failed — save with local URI as fallback
    } finally {
      setUploading(null);
    }

    const newDoc: UploadedDocument = {
      id: replaceId ?? newId(),
      category,
      section,
      uri: localUri,
      url: s3Url,
      uploadedAt: Date.now(),
      verified: false,
    };

    const updated = replaceId
      ? docs.map((d) => (d.id === replaceId ? newDoc : d))
      : [...docs, newDoc];

    await updateProfile({ documents: updated });
    // Close the CSCS picker after upload
    if (category.startsWith("CSCS Card")) setCscsOpen(false);
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

  // Check if any CSCS variant has been uploaded
  const uploadedCscs = ticketDocs.filter((d) => d.category.startsWith("CSCS Card —"));

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
        <Section label="Trade Tickets & Certifications" icon="award" colors={colors}>
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
              if (cat === "CSCS Card") {
                // Special CSCS row with expandable level picker
                const hasAny = uploadedCscs.length > 0;
                return (
                  <View key="CSCS Card">
                    <Pressable
                      onPress={() => setCscsOpen((o) => !o)}
                      style={({ pressed }) => [
                        styles.catRow,
                        { borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
                      ]}
                    >
                      <View
                        style={[
                          styles.catStatus,
                          {
                            backgroundColor: hasAny ? colors.primary + "22" : colors.elevated,
                            borderColor: hasAny ? colors.primary + "55" : colors.border,
                          },
                        ]}
                      >
                        <Feather
                          name={hasAny ? "check" : "upload"}
                          size={13}
                          color={hasAny ? colors.primary : colors.mutedForeground}
                        />
                      </View>
                      <Text style={[styles.catLabel, { color: hasAny ? colors.foreground : colors.mutedForeground }]}>
                        CSCS Card
                      </Text>
                      {hasAny ? (
                        <View style={[styles.pendingBadge, { backgroundColor: colors.accent + "22", borderColor: colors.accent + "44" }]}>
                          <Text style={[styles.pendingText, { color: colors.accent }]}>
                            {uploadedCscs.length} uploaded
                          </Text>
                        </View>
                      ) : null}
                      <Feather
                        name={cscsOpen ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={colors.mutedForeground}
                      />
                    </Pressable>

                    {/* CSCS Level picker — expands inline */}
                    {cscsOpen && (
                      <View style={[styles.cscsPanel, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                        <Text style={[styles.cscsPanelTitle, { color: colors.mutedForeground }]}>
                          Select your card colour
                        </Text>
                        {CSCS_LEVELS.map((lvl) => {
                          const fullCat = `CSCS Card — ${lvl.colour} (${lvl.level})`;
                          const alreadyUploaded = docs.find((d) => d.category === fullCat);
                          return (
                            <Pressable
                              key={lvl.colour}
                              onPress={() => uploadDoc(fullCat, "ticket")}
                              style={({ pressed }) => [
                                styles.cscsRow,
                                {
                                  borderColor: colors.border,
                                  opacity: pressed ? 0.7 : 1,
                                },
                              ]}
                            >
                              {/* Colour dot */}
                              <View style={[styles.cscsDot, { backgroundColor: lvl.hex, borderColor: lvl.hex + "88" }]} />
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.cscsColour, { color: colors.foreground }]}>
                                  {lvl.colour} Card
                                </Text>
                                <Text style={[styles.cscsLevel, { color: colors.mutedForeground }]}>
                                  {lvl.level}
                                </Text>
                              </View>
                              {alreadyUploaded ? (
                                <View style={[styles.pendingBadge, { backgroundColor: colors.accent + "22", borderColor: colors.accent + "44" }]}>
                                  <Feather name="clock" size={10} color={colors.accent} />
                                  <Text style={[styles.pendingText, { color: colors.accent }]}>Pending</Text>
                                </View>
                              ) : (
                                <Feather name="upload" size={14} color={colors.mutedForeground} />
                              )}
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              }

              const uploaded = ticketDocs.some((d) => d.category === cat);
              return (
                <CategoryRow
                  key={cat}
                  label={cat}
                  uploaded={uploaded}
                  uploading={uploading === cat}
                  onPress={() => uploadDoc(cat, "ticket")}
                  colors={colors}
                />
              );
            })}
          </View>
        </Section>

        {/* Insurance */}
        <Section label="Insurance Documents" icon="umbrella" colors={colors}>
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
                  uploading={uploading === cat}
                  onPress={() => uploadDoc(cat, "insurance")}
                  colors={colors}
                />
              );
            })}
          </View>
        </Section>

        {/* Business Verification */}
        <Section label="Business Verification" icon="briefcase" colors={colors}>
          <View style={styles.categoryList}>
            {/* Sole Trader proof */}
            {(!user.businessType || user.businessType === "sole_trader") && (
              <>
                <View style={[styles.catRow, { borderColor: colors.border }]}>
                  <View style={[styles.catStatus, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                    <Feather name="user" size={13} color={colors.mutedForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.catLabel, { color: colors.foreground }]}>Sole Trader</Text>
                    <Text style={[{ fontSize: 11, fontFamily: "PlusJakartaSans_400Regular", color: colors.mutedForeground }]}>
                      {user.businessType ? "How you work — set in your profile" : "Not set — tap Edit profile to set"}
                    </Text>
                  </View>
                  {user.businessType === "sole_trader" && (
                    <View style={[styles.pendingBadge, { backgroundColor: colors.primary + "22", borderColor: colors.primary + "44" }]}>
                      <Feather name="check" size={10} color={colors.primary} />
                      <Text style={[styles.pendingText, { color: colors.primary }]}>Set</Text>
                    </View>
                  )}
                </View>
                {user.businessType === "sole_trader" && (
                  <>
                    {(() => {
                      const uploaded = docs.find((d) => d.category === "UTR / HMRC Letter");
                      return (
                        <CategoryRow
                          key="UTR / HMRC Letter"
                          label="UTR / HMRC Letter (optional)"
                          uploaded={!!uploaded}
                          uploading={uploading === "UTR / HMRC Letter"}
                          onPress={() => uploadDoc("UTR / HMRC Letter", "business")}
                          colors={colors}
                        />
                      );
                    })()}
                  </>
                )}
              </>
            )}

            {/* Ltd Company proof */}
            {(!user.businessType || user.businessType === "limited_company") && (
              <>
                <View style={[styles.catRow, { borderColor: colors.border }]}>
                  <View style={[styles.catStatus, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                    <Feather name="layers" size={13} color={colors.mutedForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.catLabel, { color: colors.foreground }]}>Limited Company</Text>
                    <Text style={[{ fontSize: 11, fontFamily: "PlusJakartaSans_400Regular", color: colors.mutedForeground }]}>
                      {user.businessType ? "How you work — set in your profile" : "Not set — tap Edit profile to set"}
                    </Text>
                  </View>
                  {user.businessType === "limited_company" && (
                    <View style={[styles.pendingBadge, { backgroundColor: colors.primary + "22", borderColor: colors.primary + "44" }]}>
                      <Feather name="check" size={10} color={colors.primary} />
                      <Text style={[styles.pendingText, { color: colors.primary }]}>Set</Text>
                    </View>
                  )}
                </View>
                {user.businessType === "limited_company" && (
                  <>
                    {(() => {
                      const uploaded = docs.find((d) => d.category === "Certificate of Incorporation");
                      return (
                        <CategoryRow
                          key="Certificate of Incorporation"
                          label="Certificate of Incorporation (optional)"
                          uploaded={!!uploaded}
                          uploading={uploading === "Certificate of Incorporation"}
                          onPress={() => uploadDoc("Certificate of Incorporation", "business")}
                          colors={colors}
                        />
                      );
                    })()}
                  </>
                )}
              </>
            )}
          </View>

          <Text style={[{ fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: colors.mutedForeground, lineHeight: 17 }]}>
            Builders use this to understand how to pay you. Documents are optional — they just add a verified badge to your profile.
          </Text>
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
  uploading,
  onPress,
  colors,
}: {
  label: string;
  uploaded: boolean;
  uploading?: boolean;
  onPress: () => void;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={uploading}
      style={({ pressed }) => [
        styles.catRow,
        { borderColor: colors.border, opacity: pressed || uploading ? 0.6 : 1 },
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
        {uploading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Feather
            name={uploaded ? "check" : "upload"}
            size={13}
            color={uploaded ? colors.primary : colors.mutedForeground}
          />
        )}
      </View>
      <Text style={[styles.catLabel, { color: uploaded ? colors.foreground : colors.mutedForeground }]}>
        {label}
      </Text>
      {uploading ? (
        <Text style={[styles.pendingText, { color: colors.mutedForeground }]}>Uploading…</Text>
      ) : uploaded ? (
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
      <Image source={{ uri: doc.url ?? doc.uri }} style={styles.docThumb} resizeMode="cover" />
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
  // CSCS level picker
  cscsPanel: {
    marginTop: 4,
    marginBottom: 6,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 2,
  },
  cscsPanelTitle: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cscsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  cscsDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  cscsColour: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  cscsLevel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    marginTop: 1,
  },
  // Doc cards
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

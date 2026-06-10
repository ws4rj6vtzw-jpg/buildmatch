import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Avatar } from "@/components/Avatar";
import { useColors } from "@/hooks/useColors";
import { uploadToS3 } from "@/lib/uploadToS3";

type Props = {
  uri?: string;
  name?: string;
  size?: number;
  onChange: (uri: string) => void;
};

export function AvatarPicker({ uri, name, size = 88, onChange }: Props) {
  const colors = useColors();
  const [androidSheet, setAndroidSheet] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pick = async (source: "camera" | "library") => {
    try {
      let result: ImagePicker.ImagePickerResult;

      if (source === "camera") {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert(
            "Camera access needed",
            "Enable camera access in Settings to take a profile photo.",
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      const localUri = asset.uri;

      // Show the local image immediately while uploading
      onChange(localUri);
      setUploading(true);

      try {
        const filename = asset.fileName ?? `avatar_${Date.now()}.jpg`;
        const contentType = asset.mimeType ?? "image/jpeg";
        const s3Url = await uploadToS3(localUri, {
          filename,
          contentType,
          folder: "avatars",
        });
        // Replace local URI with permanent S3 URL
        onChange(s3Url);
      } catch {
        // S3 upload failed — local URI stays, photo is still shown
      } finally {
        setUploading(false);
      }
    } catch (e) {
      Alert.alert("Couldn't open picker", String(e));
    }
  };

  const open = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => undefined);
    }
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take photo", "Choose from library"],
          cancelButtonIndex: 0,
        },
        (idx) => {
          if (idx === 1) pick("camera");
          if (idx === 2) pick("library");
        },
      );
    } else if (Platform.OS === "android") {
      setAndroidSheet(true);
    } else {
      pick("library");
    }
  };

  const badgeSize = Math.max(28, size * 0.32);

  return (
    <>
      <Pressable
        onPress={open}
        disabled={uploading}
        style={({ pressed }) => ({ opacity: pressed || uploading ? 0.75 : 1 })}
      >
        <View>
          <Avatar uri={uri} name={name} size={size} />
          <View
            style={[
              styles.badge,
              {
                width: badgeSize,
                height: badgeSize,
                borderRadius: badgeSize / 2,
                backgroundColor: colors.primary,
                borderColor: colors.background,
              },
            ]}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.primaryForeground} />
            ) : (
              <Feather
                name="camera"
                size={badgeSize * 0.55}
                color={colors.primaryForeground}
              />
            )}
          </View>
        </View>
      </Pressable>

      <Modal
        visible={androidSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setAndroidSheet(false)}
      >
        <Pressable
          style={styles.sheetBg}
          onPress={() => setAndroidSheet(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[styles.sheet, { backgroundColor: colors.card }]}
          >
            <SheetRow
              icon="camera"
              label="Take photo"
              onPress={() => {
                setAndroidSheet(false);
                pick("camera");
              }}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SheetRow
              icon="image"
              label="Choose from library"
              onPress={() => {
                setAndroidSheet(false);
                pick("library");
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function SheetRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.sheetRow,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Feather name={icon} size={20} color={colors.foreground} />
      <Text style={[styles.sheetLabel, { color: colors.foreground }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  sheetBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    padding: 16,
  },
  sheet: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
  },
  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
  },
  sheetLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  divider: {
    height: 1,
    marginHorizontal: 18,
  },
});

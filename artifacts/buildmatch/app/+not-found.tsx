import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

const FIREBASE_PATHS = ["/firebaseauth/", "/__/auth/"];

export default function NotFoundScreen() {
  const router = useRouter();
  const pathname = usePathname();

  const isFirebaseCallback = FIREBASE_PATHS.some((p) =>
    pathname.startsWith(p)
  );

  useEffect(() => {
    if (!isFirebaseCallback) {
      router.replace("/");
    }
  }, [isFirebaseCallback]);

  return <View style={{ flex: 1, backgroundColor: "#0E0F12" }} />;
}

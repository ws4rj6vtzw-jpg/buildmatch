import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import auth from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

import type { AuthUser, Role } from "@/types";
import { api, setAuthToken } from "@/lib/api";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  pendingPhone: string | null;
  setPendingPhone: (phone: string | null) => void;
  sendOtp: (phone: string) => Promise<{ ok: boolean; error?: string }>;
  verifyOtp: (code: string) => Promise<{ ok: boolean; error?: string }>;
  setRole: (role: Role) => Promise<void>;
  updateProfile: (patch: Partial<AuthUser>) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "buildmatch.user.v2";
const TOKEN_KEY = "buildmatch.token.v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const confirmationRef = useRef<FirebaseAuthTypes.ConfirmationResult | null>(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(USER_KEY),
      AsyncStorage.getItem(TOKEN_KEY),
    ])
      .then(([rawUser, rawToken]) => {
        if (rawUser) setUser(JSON.parse(rawUser) as AuthUser);
        if (rawToken) {
          setToken(rawToken);
          setAuthToken(rawToken);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback(
    async (nextUser: AuthUser | null, nextToken: string | null) => {
      setUser(nextUser);
      setToken(nextToken);
      setAuthToken(nextToken);
      if (nextUser) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      } else {
        await AsyncStorage.removeItem(USER_KEY);
      }
      if (nextToken) {
        await AsyncStorage.setItem(TOKEN_KEY, nextToken);
      } else {
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
    },
    [],
  );

  const sendOtp = useCallback(async (phone: string) => {
    setPendingPhone(phone);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      confirmationRef.current = confirmation;
      return { ok: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send code";
      return { ok: false, error: msg };
    }
  }, []);

  const verifyOtp = useCallback(
    async (code: string) => {
      if (code.length !== 6) {
        return { ok: false, error: "Please enter the 6-digit code" };
      }
      if (!confirmationRef.current) {
        return { ok: false, error: "No code was sent. Please request a new one." };
      }
      try {
        const credential = await confirmationRef.current.confirm(code);
        if (!credential?.user) {
          return { ok: false, error: "Verification failed. Please try again." };
        }
        const idToken = await credential.user.getIdToken();
        const result = await api.firebaseVerify(idToken);
        if (result.error) return { ok: false, error: result.error };
        if (!result.data) return { ok: false, error: "No response from server" };

        confirmationRef.current = null;
        setPendingPhone(null);
        await persist(result.data.user, result.data.token);
        return { ok: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Incorrect code. Please try again.";
        return { ok: false, error: msg };
      }
    },
    [persist],
  );

  const setRole = useCallback(
    async (role: Role) => {
      if (!user) return;
      const optimistic = { ...user, role };
      await persist(optimistic, token);
      const result = await api.updateMe({ role });
      if (result.data) await persist(result.data, token);
    },
    [user, token, persist],
  );

  const updateProfile = useCallback(
    async (patch: Partial<AuthUser>) => {
      if (!user) return;
      const merged = { ...user, ...patch };
      const isWorker = merged.role === "worker";
      merged.profileComplete = isWorker
        ? !!(merged.fullName && merged.primaryTrade && merged.suburb)
        : !!(merged.companyName && merged.contactName && merged.suburb);
      await persist(merged, token);
      const result = await api.updateMe(patch);
      if (result.data) await persist(result.data, token);
    },
    [user, token, persist],
  );

  const signOut = useCallback(async () => {
    await auth().signOut().catch(() => {});
    await persist(null, null);
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      pendingPhone,
      setPendingPhone,
      sendOtp,
      verifyOtp,
      setRole,
      updateProfile,
      signOut,
    }),
    [user, token, loading, pendingPhone, sendOtp, verifyOtp, setRole, updateProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

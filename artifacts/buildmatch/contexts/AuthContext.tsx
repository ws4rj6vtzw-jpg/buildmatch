import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { AuthUser, Role } from "@/types";
import { api, setAuthToken } from "@/lib/api";

export type SecurityData = {
  pin: string | null;
  prompted: boolean;
};

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
  locked: boolean;
  security: SecurityData | null;
  setupPin: (pin: string) => Promise<void>;
  skipLock: () => Promise<void>;
  unlock: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "buildmatch.user.v2";
const TOKEN_KEY = "buildmatch.token.v1";
const SECURITY_KEY = "buildmatch.security.v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [security, setSecurity] = useState<SecurityData | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(USER_KEY),
      AsyncStorage.getItem(TOKEN_KEY),
      AsyncStorage.getItem(SECURITY_KEY),
    ])
      .then(([rawUser, rawToken, rawSecurity]) => {
        if (rawUser) setUser(JSON.parse(rawUser) as AuthUser);
        if (rawToken) {
          setToken(rawToken);
          setAuthToken(rawToken);
        }
        if (rawSecurity) {
          const sec = JSON.parse(rawSecurity) as SecurityData;
          setSecurity(sec);
          if (sec.pin) setLocked(true);
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
      const result = await api.sendOtp(phone);
      if (result.error) return { ok: false, error: result.error };
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
      if (!pendingPhone) {
        return { ok: false, error: "No code was sent. Please request a new one." };
      }
      try {
        const result = await api.verifyOtp(pendingPhone, code);
        if (result.error) return { ok: false, error: result.error };
        if (!result.data) return { ok: false, error: "No response from server" };

        setPendingPhone(null);
        await persist(result.data.user, result.data.token);
        return { ok: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Incorrect code. Please try again.";
        return { ok: false, error: msg };
      }
    },
    [pendingPhone, persist],
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
      if (result.data) {
        // Merge server response ON TOP of the already-merged local state so that
        // locally-managed fields the server doesn't know about (e.g. documents,
        // security, pin) are always preserved.
        const final = { ...merged, ...result.data };
        const isW = final.role === "worker";
        final.profileComplete = isW
          ? !!(final.fullName && final.primaryTrade && final.suburb)
          : !!(final.companyName && final.contactName && final.suburb);
        await persist(final, token);
      }
    },
    [user, token, persist],
  );

  const setupPin = useCallback(async (pin: string) => {
    const sec: SecurityData = { pin, prompted: true };
    setSecurity(sec);
    setLocked(false);
    await AsyncStorage.setItem(SECURITY_KEY, JSON.stringify(sec));
  }, []);

  const skipLock = useCallback(async () => {
    const sec: SecurityData = { pin: null, prompted: true };
    setSecurity(sec);
    setLocked(false);
    await AsyncStorage.setItem(SECURITY_KEY, JSON.stringify(sec));
  }, []);

  const unlock = useCallback(() => {
    setLocked(false);
  }, []);

  const signOut = useCallback(async () => {
    await persist(null, null);
    await AsyncStorage.removeItem(SECURITY_KEY);
    setSecurity(null);
    setLocked(false);
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
      locked,
      security,
      setupPin,
      skipLock,
      unlock,
    }),
    [user, token, loading, pendingPhone, sendOtp, verifyOtp, setRole, updateProfile, signOut, locked, security, setupPin, skipLock, unlock],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

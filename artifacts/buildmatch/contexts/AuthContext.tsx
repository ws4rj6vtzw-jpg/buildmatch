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

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  pendingPhone: string | null;
  setPendingPhone: (phone: string | null) => void;
  verifyOtp: (code: string) => Promise<boolean>;
  setRole: (role: Role) => Promise<void>;
  updateProfile: (patch: Partial<AuthUser>) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "buildmatch.user.v1";

function newId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw));
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback(async (next: AuthUser | null) => {
    setUser(next);
    if (next) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const verifyOtp = useCallback(
    async (code: string) => {
      if (code.length !== 6 || !pendingPhone) return false;
      const fresh: AuthUser = {
        id: newId(),
        phone: pendingPhone,
        role: "worker",
        rating: 0,
        completedJobs: 0,
        profileComplete: false,
      };
      await persist(fresh);
      setPendingPhone(null);
      return true;
    },
    [pendingPhone, persist],
  );

  const setRole = useCallback(
    async (role: Role) => {
      if (!user) return;
      await persist({ ...user, role });
    },
    [user, persist],
  );

  const updateProfile = useCallback(
    async (patch: Partial<AuthUser>) => {
      if (!user) return;
      const next = { ...user, ...patch };
      const isWorker = next.role === "worker";
      next.profileComplete = isWorker
        ? !!(next.fullName && next.primaryTrade && next.suburb)
        : !!(next.companyName && next.contactName && next.suburb);
      await persist(next);
    },
    [user, persist],
  );

  const signOut = useCallback(async () => {
    await persist(null);
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      pendingPhone,
      setPendingPhone,
      verifyOtp,
      setRole,
      updateProfile,
      signOut,
    }),
    [user, loading, pendingPhone, verifyOtp, setRole, updateProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

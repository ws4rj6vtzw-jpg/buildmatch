import type { AuthUser, Job, Swipe, Match, Message } from "@/types";

const BASE_URL = `https://${process.env.EXPO_PUBLIC_DOMAIN ?? "buildmatch.online"}/api`;

let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;
  return headers;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204) return { data: undefined };
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return { error: (json["message"] as string) ?? `Error ${res.status}` };
    }
    return { data: json as T };
  } catch {
    return { error: "Could not reach the server. Check your connection." };
  }
}

export const api = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  sendOtp: (phone: string) =>
    request<{ ok: boolean; dev?: boolean }>("POST", "/auth/send-otp", { phone }),

  verifyOtp: (phone: string, code: string) =>
    request<{ token: string; user: AuthUser }>("POST", "/auth/verify-otp", { phone, code }),

  firebaseVerify: (idToken: string) =>
    request<{ token: string; user: AuthUser }>("POST", "/auth/firebase-verify", { idToken }),

  // ── User profile ─────────────────────────────────────────────────────────
  getMe: () => request<AuthUser>("GET", "/users/me"),

  updateMe: (patch: Partial<AuthUser>) =>
    request<AuthUser>("PATCH", "/users/me", patch),

  // ── Jobs ─────────────────────────────────────────────────────────────────
  getJobs: () => request<Job[]>("GET", "/jobs"),

  postJob: (job: Omit<Job, "id" | "createdAt" | "applicants" | "builderId">) =>
    request<Job>("POST", "/jobs", job),

  // ── Swipes ───────────────────────────────────────────────────────────────
  getSwipes: () => request<Swipe[]>("GET", "/swipes"),

  swipe: (
    toId: string,
    direction: "left" | "right",
    swipeType: "worker" | "job" | "builder",
  ) => request<{ matched: boolean; matchId?: string }>("POST", "/swipes", { toId, direction, swipeType }),

  undoSwipe: () => request<{ undoneId: string | null }>("DELETE", "/swipes/last"),

  // ── Matches ───────────────────────────────────────────────────────────────
  getMatches: () => request<Match[]>("GET", "/matches"),

  // ── Messages ──────────────────────────────────────────────────────────────
  getAllMessages: () => request<Message[]>("GET", "/messages"),

  sendMessage: (matchId: string, text: string) =>
    request<Message>("POST", `/matches/${matchId}/messages`, { text }),

  // ── Push tokens ───────────────────────────────────────────────────────────
  registerPushToken: (token: string) =>
    request<{ ok: boolean }>("POST", "/push-tokens", { token }),

  // ── Applicant actions ─────────────────────────────────────────────────────
  acceptApplicant: (jobId: string, workerId: string) =>
    request<{ ok: boolean }>("POST", `/jobs/${jobId}/applicants/${workerId}/accept`),

  declineApplicant: (jobId: string, workerId: string) =>
    request<{ ok: boolean }>("POST", `/jobs/${jobId}/applicants/${workerId}/decline`),

  // ── Promo codes ───────────────────────────────────────────────────────────
  getPromoStatus: () =>
    request<{ hasPromo: boolean; spotsLeft: number }>("GET", "/promo/status"),

  redeemPromo: (code: string) =>
    request<{ success: boolean; spotsLeft: number }>("POST", "/promo/redeem", { code }),
};

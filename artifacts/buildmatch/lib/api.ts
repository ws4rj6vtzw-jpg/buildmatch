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

  // ── File uploads ─────────────────────────────────────────────────────────
  /**
   * Upload a file to S3 via the API server (multipart/form-data).
   * This is the recommended approach from React Native — FormData with a
   * { uri, type, name } object is natively supported on both iOS and Android.
   */
  uploadFile: async (
    localUri: string,
    opts: { filename: string; contentType: string; folder: string },
  ): Promise<{ data?: { publicUrl: string; viewUrl: string; key: string }; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", { uri: localUri, type: opts.contentType, name: opts.filename } as unknown as Blob);
      const headers: Record<string, string> = {};
      if (_token) headers["Authorization"] = `Bearer ${_token}`;
      const res = await fetch(
        `${BASE_URL}/upload/file?folder=${encodeURIComponent(opts.folder)}`,
        { method: "POST", headers, body: formData },
      );
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        return { error: (json["message"] as string) ?? `Upload error ${res.status}` };
      }
      return { data: json as { publicUrl: string; viewUrl: string; key: string } };
    } catch {
      return { error: "Could not reach the server. Check your connection." };
    }
  },

  presignUpload: (body: { filename: string; contentType: string; folder: string }) =>
    request<{ uploadUrl: string; viewUrl?: string; publicUrl?: string; key: string }>(
      "POST",
      "/upload/presign",
      body,
    ),

  // ── Payments / Placements ────────────────────────────────────────────────
  getPaymentMethod: () =>
    request<{
      hasCard: boolean;
      card?: { brand: string; last4: string; expMonth: number; expYear: number } | null;
    }>("GET", "/payments/payment-method"),

  createSetupIntent: () =>
    request<{ clientSecret: string; publishableKey: string; customerId: string }>(
      "POST",
      "/payments/setup-intent",
    ),

  confirmHire: (body: { matchId?: string; workerId: string; tier: string }) =>
    request<{
      success: boolean;
      placementId: string;
      charged: boolean;
      amountPence: number;
      status?: string;
    }>("POST", "/payments/confirm-hire", body),

  getPlacements: () =>
    request<Array<{
      id: string;
      workerId: string;
      matchId?: string;
      amountPence: number;
      tier: string;
      status: string;
      createdAt: string;
    }>>("GET", "/payments/placements"),
};

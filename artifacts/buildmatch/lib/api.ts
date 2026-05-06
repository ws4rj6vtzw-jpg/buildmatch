const BASE_URL = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

async function post<T>(path: string, body: unknown): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({})) as Record<string, unknown>;
    if (!res.ok) {
      return { error: (json["message"] as string) ?? `Error ${res.status}` };
    }
    return { data: json as T };
  } catch {
    return { error: "Could not reach the server. Check your connection." };
  }
}

export const api = {
  sendOtp: (phone: string) =>
    post<{ ok: boolean; dev?: boolean }>("/auth/send-otp", { phone }),

  verifyOtp: (phone: string, code: string) =>
    post<{ ok: boolean }>("/auth/verify-otp", { phone, code }),
};

import { logger } from "./logger";

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  if (!expoPushToken.startsWith("ExponentPushToken[")) {
    logger.warn({ expoPushToken }, "Skipping push — not a valid Expo push token");
    return;
  }

  try {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      body: JSON.stringify({
        to: expoPushToken,
        title,
        body,
        data,
        sound: "default",
        priority: "high",
      }),
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, "Expo push send returned non-OK status");
    }
  } catch (err) {
    logger.error({ err }, "Failed to send Expo push notification");
  }
}

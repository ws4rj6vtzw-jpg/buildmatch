import { api } from "@/lib/api";

/**
 * Upload a local file URI to S3 via the API server (multipart/form-data).
 *
 * Uses the server-side upload endpoint — the most reliable cross-platform approach:
 *   - React Native's FormData natively supports { uri, type, name } objects
 *   - Works on both iOS (file://) and Android (content:// and file://)
 *   - No presigned URL complexity, no XHR blob conversion
 *   - Single authenticated request — server handles S3 auth
 *
 * Returns a permanent S3 public URL.
 */
export async function uploadToS3(
  localUri: string,
  opts: { filename: string; contentType: string; folder: string },
): Promise<string> {
  const { data, error } = await api.uploadFile(localUri, opts);
  if (!data || error) throw new Error(error ?? "Upload failed");

  // Prefer permanent public URL; fall back to presigned GET (7-day expiry)
  const displayUrl = data.publicUrl ?? data.viewUrl;
  if (!displayUrl) throw new Error("Server did not return a display URL");
  return displayUrl;
}

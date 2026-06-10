import { api } from "@/lib/api";

/**
 * Upload a local file URI to S3 via the API's presign endpoint.
 * Returns the public S3 URL on success, or throws on failure.
 */
export async function uploadToS3(
  localUri: string,
  opts: { filename: string; contentType: string; folder: string },
): Promise<string> {
  const { data, error } = await api.presignUpload(opts);
  if (!data || error) throw new Error(error ?? "Could not get upload URL");

  const blob = await (await fetch(localUri)).blob();

  const uploadRes = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": opts.contentType },
    body: blob,
  });

  if (!uploadRes.ok) {
    throw new Error(`S3 upload failed: ${uploadRes.status}`);
  }

  return data.publicUrl;
}

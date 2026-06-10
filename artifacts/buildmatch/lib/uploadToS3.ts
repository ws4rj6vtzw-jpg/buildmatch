import { api } from "@/lib/api";

/**
 * Upload a local file URI to S3 via the API's presign endpoint.
 *
 * Uses React Native's native XHR with `{ uri, type, name }` body — this is
 * the only reliable cross-platform method for uploading file:// and
 * content:// URIs from iOS and Android. fetch(localUri).blob() does NOT work
 * reliably on Android.
 *
 * Returns a permanent S3 display URL (presigned GET or public URL).
 */
export async function uploadToS3(
  localUri: string,
  opts: { filename: string; contentType: string; folder: string },
): Promise<string> {
  const { data, error } = await api.presignUpload(opts);
  if (!data || error) throw new Error(error ?? "Could not get upload URL");

  const displayUrl = data.viewUrl ?? data.publicUrl;
  if (!displayUrl) throw new Error("Server did not return a display URL");

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl);
    xhr.setRequestHeader("Content-Type", opts.contentType);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed: HTTP ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("S3 upload network error"));
    xhr.ontimeout = () => reject(new Error("S3 upload timed out"));
    xhr.timeout = 60000;

    // Pass the file URI as a native object — React Native's XHR handles
    // file:// and content:// URIs natively on both iOS and Android.
    // Do NOT use fetch(localUri).blob() — it fails on Android.
    xhr.send({ uri: localUri, type: opts.contentType, name: opts.filename } as unknown as Document);
  });

  return displayUrl;
}

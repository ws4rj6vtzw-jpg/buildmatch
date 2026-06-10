import { api } from "@/lib/api";

/**
 * Upload a local file URI to S3 via the API's presign endpoint.
 *
 * Two-step XHR approach — the only method that reliably works on both
 * iOS and Android in React Native:
 *   1. GET the local file as a Blob using XHR with responseType='blob'.
 *      (fetch(localUri) fails on Android; { uri } object body sends JSON)
 *   2. PUT the Blob to S3 via the presigned URL.
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

  // Step 1: read the local file as a Blob via XHR (works for file:// and content:// on both platforms)
  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.response instanceof Blob && xhr.response.size > 0) {
        resolve(xhr.response);
      } else {
        reject(new Error("Could not read local file (empty response)"));
      }
    };
    xhr.onerror = () => reject(new Error("Could not read local file"));
    xhr.open("GET", localUri);
    xhr.send();
  });

  // Step 2: PUT the blob directly to S3
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
    xhr.send(blob);
  });

  return displayUrl;
}

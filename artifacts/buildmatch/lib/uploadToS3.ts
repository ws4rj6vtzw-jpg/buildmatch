import { api } from "@/lib/api";

/**
 * Upload a local file URI to S3 via the API's presign endpoint.
 * Uses XMLHttpRequest for reliable binary upload in React Native.
 * Returns the best available display URL: presigned GET URL (viewUrl) if the
 * server supports it, falling back to the public URL.
 */
export async function uploadToS3(
  localUri: string,
  opts: { filename: string; contentType: string; folder: string },
): Promise<string> {
  const { data, error } = await api.presignUpload(opts);
  if (!data || error) throw new Error(error ?? "Could not get upload URL");

  const displayUrl = data.viewUrl ?? data.publicUrl;
  if (!displayUrl) throw new Error("Server did not return a display URL");

  // Read the file as a blob via fetch (works with file:// URIs in React Native)
  const fileResponse = await fetch(localUri);
  if (!fileResponse.ok) throw new Error("Could not read local file");
  const blob = await fileResponse.blob();

  // Use XHR for the PUT upload — more reliable for binary data in React Native
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl);
    xhr.setRequestHeader("Content-Type", opts.contentType);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("S3 upload network error"));
    xhr.send(blob);
  });

  return displayUrl;
}

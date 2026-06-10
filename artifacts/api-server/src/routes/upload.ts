import { Router } from "express";
import multer from "multer";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const REGION = process.env.AWS_REGION ?? "us-east-1";

// 7 days — maximum allowed for IAM user credentials
const VIEW_URL_EXPIRY_SECONDS = 60 * 60 * 24 * 7;

// Multer: buffer the upload in memory (files are small — avatars/docs)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

/**
 * POST /api/upload/file
 * Accepts multipart/form-data with a `file` field.
 * Uploads to S3 and returns a permanent public URL.
 * This is the recommended upload path from React Native — FormData + native
 * file:// URIs work reliably on both iOS and Android without any blob conversion.
 */
router.post(
  "/upload/file",
  requireAuth,
  upload.single("file"),
  async (req, res): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const folder = ((req.query["folder"] as string) ?? "uploads").replace(
      /[^a-zA-Z0-9_-]/g,
      "",
    );
    const originalName = req.file.originalname ?? "upload.jpg";
    const ext = originalName.split(".").pop() ?? "jpg";
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const contentType = req.file.mimetype ?? "image/jpeg";

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: req.file.buffer,
          ContentType: contentType,
        }),
      );

      // Public URL — works when the bucket has a public-read policy
      const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

      // Presigned GET URL as fallback (7 days) — works regardless of bucket policy
      const viewUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: BUCKET, Key: key }),
        { expiresIn: VIEW_URL_EXPIRY_SECONDS },
      );

      req.log.info({ key, folder }, "File uploaded to S3");
      res.json({ publicUrl, viewUrl, key });
    } catch (err) {
      req.log.error({ err }, "Failed to upload file to S3");
      res.status(500).json({ message: "Upload failed" });
    }
  },
);

/**
 * POST /api/upload/presign  (kept for backward compat)
 * Returns presigned PUT + GET URLs so the client can upload directly to S3.
 */
router.post("/upload/presign", requireAuth, async (req, res): Promise<void> => {
  const { filename, contentType, folder } = req.body as {
    filename?: string;
    contentType?: string;
    folder?: string;
  };

  if (!filename || !contentType) {
    res.status(400).json({ message: "filename and contentType are required" });
    return;
  }

  const safeFolder = (folder ?? "uploads").replace(/[^a-zA-Z0-9_-]/g, "");
  const ext = filename.split(".").pop() ?? "jpg";
  const key = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  try {
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const getCommand = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const [uploadUrl, viewUrl] = await Promise.all([
      getSignedUrl(s3, putCommand, { expiresIn: 300 }),
      getSignedUrl(s3, getCommand, { expiresIn: VIEW_URL_EXPIRY_SECONDS }),
    ]);

    const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    res.json({ uploadUrl, viewUrl, publicUrl, key });
  } catch (err) {
    req.log.error({ err }, "Failed to generate presigned URL");
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
});

export default router;

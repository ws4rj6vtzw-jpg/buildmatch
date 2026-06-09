import { Router } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    res.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    req.log.error({ err }, "Failed to generate presigned URL");
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
});

export default router;

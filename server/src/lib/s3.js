// src/lib/s3.js
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getReplayDownloadUrl({
  bucket,
  key,
  filename,
  expiresInSeconds = 60,
}) {
  const cmd = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
    // Optional: force a generic content type if you want
    // ResponseContentType: "application/octet-stream",
  });

  return getSignedUrl(s3, cmd, { expiresIn: expiresInSeconds });
}

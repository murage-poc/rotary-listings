import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: 'us-east-1', // MinIO ignores region but AWS SDK requires it
  endpoint: 'http://lemon.com:9000',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'ravinier',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'somesecretpassword',
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET = process.env.MINIO_BUCKET || 'ravinier';

export async function uploadImage({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer | Uint8Array | Blob | string;
  contentType: string;
}) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function getImageUrl(key: string, expiresInSeconds = 3600) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
} 
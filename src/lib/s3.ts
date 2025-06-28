import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET } from './env';

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = S3_BUCKET;

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
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipe = promisify(pipeline);

const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const S3_BUCKET = process.env.S3_BUCKET;

if (!S3_ENDPOINT || !S3_ACCESS_KEY || !S3_SECRET_KEY || !S3_BUCKET) {
  throw new Error('Missing S3 env vars. Please set S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET');
}

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function uploadImageFromUrl(key, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'image/jpeg',
  }));
  console.log(`Uploaded ${key}`);
}

async function main() {
  const width = 600;
  const height = 400;
  const tasks = [];
  for (let i = 1; i <= 50; i++) {
    const picsumId = (i % 1000) + 1;
    const url = `https://picsum.photos/id/${picsumId}/${width}/${height}`;
    const key = `listing-images/${i}.jpg`;
    tasks.push(uploadImageFromUrl(key, url));
  }
  await Promise.all(tasks);
  console.log('All images uploaded!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 
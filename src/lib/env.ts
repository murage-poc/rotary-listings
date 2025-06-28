function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const DATABASE_URL = requireEnv('DATABASE_URL');
export const S3_ENDPOINT = requireEnv('S3_ENDPOINT');
export const S3_ACCESS_KEY = requireEnv('S3_ACCESS_KEY');
export const S3_SECRET_KEY = requireEnv('S3_SECRET_KEY');
export const S3_BUCKET = requireEnv('S3_BUCKET'); 
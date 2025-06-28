import { json, error, type RequestHandler } from '@sveltejs/kit';
import { uploadImage, getImageUrl } from '$lib/s3';
import { db } from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();
  const file = form.get('file') as File | null;
  const listing_id = form.get('listing_id');
  const alt = form.get('alt') as string | null;

  if (!file || !listing_id) {
    throw error(400, 'Missing file or listing_id');
  }

  const key = `${listing_id}/${crypto.randomUUID()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  await uploadImage({
    key,
    body: Buffer.from(arrayBuffer),
    contentType: file.type,
  });

  // Store image metadata in DB
  const inserted = await db
    .insertInto('images')
    .values({ listing_id: Number(listing_id), url: key, alt })
    .returning(['id', 'url', 'alt'])
    .executeTakeFirst();

  return json(inserted);
};

export const GET: RequestHandler = async ({ url }) => {
  const key = url.searchParams.get('key');
  if (!key) throw error(400, 'Missing key');
  const signedUrl = await getImageUrl(key);
  return json({ url: signedUrl });
}; 
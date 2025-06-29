import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
  const listings = await db
    .selectFrom('listings')
    .leftJoin('images', 'images.listing_id', 'listings.id')
    .selectAll('listings')
    .select(db.fn.min('images.url').as('image_key'))
    .groupBy('listings.id')
    .execute();
  return json(listings);
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const { title, description, price_per_guest, host_id, category, location } = data;
  if (!title || !description || !price_per_guest || !host_id || !category || !location) {
    throw error(400, 'Missing required fields');
  }
  const inserted = await db
    .insertInto('listings')
    .values({ title, description, price_per_guest, host_id, category, location })
    .returningAll()
    .executeTakeFirst();
  return json(inserted);
}; 
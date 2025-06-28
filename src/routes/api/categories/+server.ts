import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';

export const GET: RequestHandler = async () => {
  const categories = await db
    .selectFrom('listings')
    .select('category')
    .distinct()
    .execute();
  return json(categories.map(c => c.category));
}; 
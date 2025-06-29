import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';

export const GET: RequestHandler = async () => {
  const categories = await db
    .selectFrom('categories')
    .select('name')
    .execute();
  
  return json(categories.map(c => c.name));
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const { name } = data;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw error(400, 'Category name is required');
  }

  const trimmedName = name.trim();
  
  // Check if category already exists
  const existing = await db
    .selectFrom('categories')
    .select('id')
    .where('name', '=', trimmedName)
    .executeTakeFirst();
    
  if (existing) {
    throw error(409, 'Category already exists');
  }

  const inserted = await db
    .insertInto('categories')
    .values({ name: trimmedName })
    .returningAll()
    .executeTakeFirst();
    
  return json(inserted);
}; 
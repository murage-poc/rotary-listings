import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';

export const GET: RequestHandler = async () => {
  const hosts = await db.selectFrom('hosts').selectAll().execute();
  return json(hosts);
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const { name, avatar_url } = data;
  if (!name) {
    throw error(400, 'Missing required field: name');
  }
  const inserted = await db
    .insertInto('hosts')
    .values({ name, avatar_url })
    .returningAll()
    .executeTakeFirst();
  return json(inserted);
}; 
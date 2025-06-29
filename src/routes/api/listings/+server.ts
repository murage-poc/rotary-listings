import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getImageUrl } from '$lib/s3';

export const GET: RequestHandler = async ({ url }) => {
  const category = url.searchParams.get('category');
  let query = db
    .selectFrom('listings')
    .leftJoin('images', 'images.listing_id', 'listings.id')
    .leftJoin('categories', 'categories.id', 'listings.category_id')
    .selectAll('listings')
    .select('categories.name as category_name')
    .select(db.fn.min('images.url').as('image_key'))
    .groupBy(['listings.id', 'categories.name']);

  if (category && category !== 'All') {
    query = query.where('categories.name', '=', category);
  }

  const listings = await query.execute();
  
  // Generate signed URLs for images
  const listingsWithImages = await Promise.all(
    listings.map(async (listing) => {
      let imageUrl = null;
      if (listing.image_key) {
        imageUrl = await getImageUrl(listing.image_key);
      }
      return { 
        ...listing, 
        imageUrl,
        category: listing.category_name // Map category_name to category for compatibility
      };
    })
  );

  return json(listingsWithImages);
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const { title, description, price_per_guest, host_id, category, location } = data;
  if (!title || !description || !price_per_guest || !host_id || !category || !location) {
    throw error(400, 'Missing required fields');
  }

  // Get category_id from category name
  const categoryRecord = await db
    .selectFrom('categories')
    .select('id')
    .where('name', '=', category)
    .executeTakeFirst();

  if (!categoryRecord) {
    throw error(400, 'Invalid category');
  }

  const inserted = await db
    .insertInto('listings')
    .values({ 
      title, 
      description, 
      price_per_guest, 
      host_id, 
      category_id: categoryRecord.id, 
      location 
    })
    .returningAll()
    .executeTakeFirst();
  return json(inserted);
}; 
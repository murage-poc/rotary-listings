import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('Missing DATABASE_URL env var');

const __dirname = dirname(fileURLToPath(import.meta.url));

const seedPath = path.resolve(__dirname, 'data.json');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
const { categories, hosts, listings, images } = seed;

const iconsDir = path.resolve(__dirname, 'icons');

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    await client.query('BEGIN');
    
    // Clear existing data
    await client.query('DELETE FROM images');
    await client.query('DELETE FROM listings');
    await client.query('DELETE FROM hosts');
    await client.query('DELETE FROM categories');
    
    // Insert categories first
    for (const category of categories) {
      if (category.icon_path) {
        const iconPath = path.join(iconsDir, category.icon_path);
        category.icon_svg = fs.readFileSync(iconPath, 'utf-8');
      } else {
        category.icon_svg = '';
      }
      await client.query('INSERT INTO categories (id, name, icon_svg) VALUES ($1, $2, $3)', [category.id, category.name, category.icon_svg]);
    }
    
    // Insert hosts
    for (const host of hosts) {
      await client.query('INSERT INTO hosts (id, name, avatar_url) VALUES ($1, $2, $3)', [host.id, host.name, host.avatar_url]);
    }
    
    // Insert listings with category_id foreign key
    for (const listing of listings) {
      await client.query(
        'INSERT INTO listings (id, title, description, price_per_guest, host_id, category_id, location) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [listing.id, listing.title, listing.description, listing.price_per_guest, listing.host_id, listing.category_id, listing.location]
      );
    }
    
    // Insert images
    for (const image of images) {
      await client.query(
        'INSERT INTO images (listing_id, url, alt) VALUES ($1, $2, $3)',
        [image.listing_id, image.url, image.alt]
      );
    }
    
    await client.query('COMMIT');
    console.log('Seeded categories, hosts, listings, and images from seed.json!');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 
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
const { hosts, listings, images } = seed;

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM images');
    await client.query('DELETE FROM listings');
    await client.query('DELETE FROM hosts');
    for (const host of hosts) {
      await client.query('INSERT INTO hosts (id, name, avatar_url) VALUES ($1, $2, $3)', [host.id, host.name, host.avatar_url]);
    }
    for (const listing of listings) {
      await client.query(
        'INSERT INTO listings (id, title, description, price_per_guest, host_id, category, location) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [listing.id, listing.title, listing.description, listing.price_per_guest, listing.host_id, listing.category, listing.location]
      );
    }
    for (const image of images) {
      await client.query(
        'INSERT INTO images (listing_id, url, alt) VALUES ($1, $2, $3)',
        [image.listing_id, image.url, image.alt]
      );
    }
    await client.query('COMMIT');
    console.log('Seeded hosts, listings, and images from seed.json!');
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
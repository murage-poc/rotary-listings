import { Kysely, PostgresDialect, Generated } from 'kysely';
import { Pool } from 'pg';

export interface HostsTable {
  id: Generated<number>;
  name: string;
  avatar_url: string | null;
}

export interface ListingsTable {
  id: Generated<number>;
  title: string;
  description: string;
  price_per_guest: number;
  host_id: number;
  category: string;
  location: string;
  created_at: Generated<Date>;
}

export interface ImagesTable {
  id: Generated<number>;
  listing_id: number;
  url: string;
  alt: string | null;
}

export interface Database {
  hosts: HostsTable;
  listings: ListingsTable;
  images: ImagesTable;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://ravinier_owner:somesecretpassword@postgresd:5432/ravinier?sslmode=disable&max_conns=20&max_idle_conns=4',
  }),
});

export const db = new Kysely<Database>({
  dialect,
}); 
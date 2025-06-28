import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// Define your database schema types here
export interface Database {
  // Example:
  // listings: ListingsTable;
  // images: ImagesTable;
  // hosts: HostsTable;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://ravinier_owner:somesecretpassword@postgresd:5432/ravinier?sslmode=disable&max_conns=20&max_idle_conns=4',
  }),
});

export const db = new Kysely<Database>({
  dialect,
}); 
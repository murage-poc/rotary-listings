import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './db-schema';
import { DATABASE_URL } from './env';

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: DATABASE_URL,
  }),
});

export const db = new Kysely<Database>({
  dialect,
}); 
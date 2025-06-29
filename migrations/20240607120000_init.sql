-- migrate:up
CREATE TABLE IF NOT EXISTS hosts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_per_guest NUMERIC NOT NULL,
    host_id INTEGER NOT NULL REFERENCES hosts(id),
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT
);

-- migrate:down
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS hosts; 
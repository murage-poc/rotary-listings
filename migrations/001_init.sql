-- Hosts table
CREATE TABLE hosts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    avatar_url TEXT
);

-- Listings table
CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_per_guest NUMERIC NOT NULL,
    host_id INTEGER NOT NULL REFERENCES hosts(id),
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Images table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT
); 
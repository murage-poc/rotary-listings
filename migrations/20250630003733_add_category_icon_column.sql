-- migrate:up

-- Add icon_svg column to categories table for SVG icons
ALTER TABLE categories ADD COLUMN icon_svg TEXT;

-- migrate:down

ALTER TABLE categories DROP COLUMN icon_svg;


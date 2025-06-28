import type { Generated } from 'kysely';

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
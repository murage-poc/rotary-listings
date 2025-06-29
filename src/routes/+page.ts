import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  const category = url.searchParams.get('category') || 'All';

  // Fetch categories
  const catRes = await fetch('/api/categories');
  const categories = ['All', ...(await catRes.json())];

  // Fetch listings
  let apiUrl = '/api/listings';
  if (category !== 'All') {
    apiUrl += `?category=${encodeURIComponent(category)}`;
  }
  const res = await fetch(apiUrl);
  const listings = await res.json();

  // Fetch hosts
  const hostRes = await fetch('/api/hosts');
  const hosts = await hostRes.json();

  return { listings, categories, hosts, selectedCategory: category };
}; 
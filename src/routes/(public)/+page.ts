import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  // Fetch static data once (categories and hosts)
  const [catRes, hostRes] = await Promise.all([
    fetch('/api/categories'),
    fetch('/api/hosts')
  ]);

  const categories = await catRes.json();
  const hosts = await hostRes.json();

  return { categories, hosts };
}; 
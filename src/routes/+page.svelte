<script lang="ts">
  import { onMount } from 'svelte';
  let listings: any[] = [];
  let loading = true;
  let search = '';
  let selectedCategory = 'All';
  let categories: string[] = ['All'];

  async function getSignedUrl(key: string): Promise<string | null> {
    if (!key) return null;
    const res = await fetch(`/api/images?key=${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  }

  onMount(async () => {
    // Fetch categories from API
    const catRes = await fetch('/api/categories');
    const apiCategories = await catRes.json();
    categories = ['All', ...apiCategories];

    // Fetch listings
    const res = await fetch('/api/listings');
    const rawListings = await res.json();
    listings = await Promise.all(
      rawListings.map(async (listing: any) => {
        let imageUrl = null;
        if (listing.image_key) {
          imageUrl = await getSignedUrl(listing.image_key);
        }
        return { ...listing, imageUrl };
      })
    );
    loading = false;
  });

  $: filteredListings = listings.filter(l =>
    (selectedCategory === 'All' || l.category === selectedCategory) &&
    (l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()))
  );
</script>

<main class="min-h-screen bg-gray-50">
  <header class="py-6 px-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow">
    <div class="flex items-center gap-2">
      <img src="/favicon.png" alt="Logo" class="h-8 w-8" />
      <span class="text-2xl font-bold tracking-tight">air-bnb</span>
    </div>
    <div class="mt-4 md:mt-0 flex-1 flex justify-center">
      <input type="text" placeholder="Search destinations" class="w-full max-w-md px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400" bind:value={search} />
    </div>
    <div class="hidden md:flex items-center gap-4">
      <button class="text-gray-700 font-medium">Stays</button>
      <button class="text-gray-700 font-medium">Experiences</button>
      <button class="text-gray-700 font-medium">Online Experiences</button>
    </div>
  </header>

  <section class="p-6">
    <div class="flex gap-2 overflow-x-auto pb-4 mb-4">
      {#each categories as category}
        <button
          class="px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition
            {selectedCategory === category ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}"
          onclick={() => selectedCategory = category}
        >
          {category}
        </button>
      {/each}
    </div>
    <h2 class="text-xl font-semibold mb-4">Featured Listings</h2>
    {#if loading}
      <div>Loading...</div>
    {:else if filteredListings.length === 0}
      <div>No listings found.</div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each filteredListings as listing}
          <div class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
            <div class="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
              {#if listing.imageUrl}
                <img src={listing.imageUrl} alt={listing.title} class="object-cover w-full h-full" />
              {:else}
                <span class="text-gray-400">Image</span>
              {/if}
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <h3 class="font-bold text-lg mb-1">{listing.title}</h3>
              <p class="text-gray-600 text-sm flex-1">{listing.description}</p>
              <div class="mt-2 flex items-center justify-between">
                <span class="font-semibold text-pink-600">€{listing.price_per_guest} per guest</span>
                <span class="text-xs text-gray-400">{listing.category}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</main>

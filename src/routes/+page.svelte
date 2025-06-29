<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
  
  // Get categories and hosts from page data
  const { categories, hosts } = data;

  // Use $state for local UI state
  let listings = $state<any[]>([]);
  const selectedCategory = $derived(page.url.searchParams.get('category')?? '');
  let loading = $state(false);

  // Function to fetch listings based on category
  async function fetchListings(category: string) {
    loading = true;
    try {
      let apiUrl = '/api/listings';
      if (category) {
        apiUrl += `?category=${encodeURIComponent(category)}`;
      }
      const res = await fetch(apiUrl);
      listings = await res.json();
    } catch (error) {
      console.error('Error fetching listings:', error);
      listings = [];
    } finally {
      loading = false;
    }
  }

  // Fetch listings when selectedCategory changes (including on mount)
  $effect(() => {
    if (selectedCategory !== undefined) {
      fetchListings(selectedCategory);
    }
  });

  // When a category is selected, update URL
  function selectCategory(category: string) {
    // Update URL
    const url = new URL(page.url);
    url.searchParams.set('category', category);
    goto(url.toString(), { replaceState: false });
  }
</script>

<main class="min-h-screen bg-gray-50">
  <header class="py-6 px-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow">
    <div class="flex items-center gap-2">
      <img src="/logo.svg" alt="air-bnb Logo" class="h-8" />
    </div>
    <div class="mt-4 md:mt-0 flex-1 flex justify-center">
      <input type="text" placeholder="Search destinations" class="w-full max-w-md px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400" />
    </div>
    <div class="hidden md:flex items-center gap-4">
      <button class="text-gray-700 font-medium">Stays</button>
      <button class="text-gray-700 font-medium">Experiences</button>
      <button class="text-gray-700 font-medium">Online Experiences</button>
      <button 
        onclick={() => goto('/admin')}
        class="text-gray-700 font-medium hover:text-pink-500 transition"
      >
        Admin
      </button>
    </div>
  </header>

  <section class="p-6">
    <div class="flex gap-2 overflow-x-auto pb-4 mb-4">
      <!-- Static "All" button -->
      <button
        class="px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition {selectedCategory === '' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}"
        onclick={() => selectCategory('')}
      >
        All
      </button>
      
      <!-- Dynamic category buttons -->
      {#if categories}
        {#each categories as category}
          <button
            class="px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition {selectedCategory === category ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}"
            onclick={() => selectCategory(category as string)}
          >
            {category}
          </button>
        {/each}
      {/if}
    </div>
    <h2 class="text-xl font-semibold mb-4">Featured Listings</h2>
    {#if !listings}
      <div>Loading...</div>
    {:else if listings.length === 0}
      <div>No listings found.</div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each listings as listing}
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

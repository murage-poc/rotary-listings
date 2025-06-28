<script lang="ts">
  import { onMount } from 'svelte';
  let listings: any[] = [];
  let loading = true;

  onMount(async () => {
    const res = await fetch('/api/listings');
    listings = await res.json();
    loading = false;
  });
</script>

<main class="min-h-screen bg-gray-50">
  <header class="py-6 px-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow">
    <div class="flex items-center gap-2">
      <img src="/favicon.png" alt="Logo" class="h-8 w-8" />
      <span class="text-2xl font-bold tracking-tight">air-bnb</span>
    </div>
    <div class="mt-4 md:mt-0 flex-1 flex justify-center">
      <input type="text" placeholder="Search destinations" class="w-full max-w-md px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400" />
    </div>
    <div class="hidden md:flex items-center gap-4">
      <button class="text-gray-700 font-medium">Stays</button>
      <button class="text-gray-700 font-medium">Experiences</button>
      <button class="text-gray-700 font-medium">Online Experiences</button>
    </div>
  </header>

  <section class="p-6">
    <h2 class="text-xl font-semibold mb-4">Featured Listings</h2>
    {#if loading}
      <div>Loading...</div>
    {:else if listings.length === 0}
      <div>No listings found.</div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each listings as listing}
          <div class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
            <div class="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
              <!-- TODO: Replace with image from API -->
              <span class="text-gray-400">Image</span>
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

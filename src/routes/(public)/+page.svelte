<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  // Placeholder SVGs for all categories (replace with real icons as needed)
  const DefaultIcon = `<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' class='w-5 h-5'><circle cx='12' cy='12' r='9'/></svg>`;
  const AllIcon = `<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' class='w-5 h-5'><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2' fill='white'/><circle cx='12' cy='12' r='4' fill='currentColor'/></svg>`;
  // Map category names to icons (add/replace as needed)
  const categoryIcons: Record<string, string> = {
    'All': AllIcon,
    'Icons': DefaultIcon,
    'Beachfront': DefaultIcon,
    'Countryside': DefaultIcon,
    'Amazing pools': DefaultIcon,
    'Bed & breakfasts': DefaultIcon,
    'Luxe': DefaultIcon,
    'Amazing views': DefaultIcon,
    'Cabins': DefaultIcon,
    'National parks': DefaultIcon,
    'Farms': DefaultIcon,
    'Castles': DefaultIcon,
    'Lake': DefaultIcon,
    'Mansions': DefaultIcon,
    'Tiny homes': DefaultIcon,
    // Add more as needed
  };

  let { data } = $props();
  const { categories, hosts } = data;

  // Use $state for local UI state
  let listings = $state<any[]>([]);
  let allListings = $state<any[]>([]); // Store all listings for search
  const selectedCategory = $derived(page.url.searchParams.get('category')?? '');
  const searchQuery = $derived(page.url.searchParams.get('search')?? '');
  let loading = $state(true); // Start with loading true

  // Function to fetch listings based on category
  async function fetchListings(category: string) {
    loading = true;
    try {
      let apiUrl = '/api/listings';
      if (category) {
        apiUrl += `?category=${encodeURIComponent(category)}`;
      }
      const res = await fetch(apiUrl);
      const fetchedListings = await res.json();
      allListings = fetchedListings;
      listings = fetchedListings;
    } catch (error) {
      console.error('Error fetching listings:', error);
      listings = [];
      allListings = [];
    } finally {
      loading = false;
    }
  }

  // Function to filter listings by search query
  function filterListings() {
    if (!searchQuery) {
      listings = allListings;
      return;
    }
    
    const query = searchQuery.toLowerCase();
    listings = allListings.filter(listing => 
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.location.toLowerCase().includes(query)
    );
  }

  // Fetch listings when selectedCategory changes (including on mount)
  $effect(() => {
    if (selectedCategory !== undefined) {
      fetchListings(selectedCategory);
    }
  });

  // Filter listings when search query changes
  $effect(() => {
    filterListings();
  });

  // When a category is selected, update URL
  function selectCategory(category: string) {
    // Update URL
    const url = new URL(page.url);
    url.searchParams.set('category', category);
    goto(url.toString(), { replaceState: false });
  }

  // Handle search input
  function handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const url = new URL(page.url);
    if (input.value) {
      url.searchParams.set('search', input.value);
    } else {
      url.searchParams.delete('search');
    }
    goto(url.toString(), { replaceState: false });
  }
</script>

<svelte:head>
  <!-- Preload critical resources -->
  <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml">
</svelte:head>

<!-- Skeleton snippet for reuse -->
{#snippet skeleton()}
  <div class="bg-white rounded-xl shadow overflow-hidden flex flex-col animate-pulse min-h-[336px]">

    <div class="bg-gray-200 flex-1 w-full"></div>

    <div class="p-4 flex flex-col">
      <div class="h-6 bg-gray-200 rounded mb-2"></div>
      <div class="h-10 bg-gray-200 rounded mb-2"></div>
      <div class="mt-2 flex items-center justify-between">
        <div class="h-4 bg-gray-200 rounded w-24"></div>
        <div class="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
{/snippet}

<!-- Image placeholder snippet for reuse -->
{#snippet imagePlaceholder()}
  <div class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
    <div class="text-center">
      <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <div class="text-xs text-gray-500">Loading...</div>
    </div>
  </div>
{/snippet}

<main class="min-h-screen bg-[#f7f7fa]">
  <!-- Category Navigation Bar -->
  <section class="border-t border-gray-200 bg-[#f7f7fa] w-full mt-6">
    <div class="flex gap-4 overflow-x-auto px-6 py-4">
      <!-- All Button -->
      <button
        class="flex flex-col items-center justify-center w-14 h-14 bg-transparent transition-all duration-150
          {selectedCategory === '' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}"
        onclick={() => selectCategory('')}
        style="box-shadow: none; border-radius: 0; border: none;"
      >
        <span class="w-6 h-6 mb-1 flex items-center justify-center">
          {@html categoryIcons['All']}
        </span>
        <span class="text-xs font-normal">All</span>
      </button>
      <!-- Dynamic category buttons with icons -->
      {#if categories}
        {#each categories as category}
          <button
            class="flex flex-col items-center justify-center min-w-[72px] h-14 px-2 bg-transparent transition-all duration-150
              {selectedCategory === category ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}"
            onclick={() => selectCategory(category as string)}
            style="box-shadow: none; border-radius: 0; border: none;"
          >
            <span class="w-6 h-6 mb-1 flex items-center justify-center">
              {@html categoryIcons[category] || DefaultIcon}
            </span>
            <span class="text-xs font-normal">{category}</span>
          </button>
        {/each}
      {/if}
    </div>
  </section>
  <!-- Search results info -->
  {#if searchQuery}
    <div class="mb-4 text-sm text-gray-600">
      Search results for "{searchQuery}": {listings.length} listing{listings.length !== 1 ? 's' : ''}
    </div>
  {/if}
  <h2 class="text-xl font-semibold mb-4">Featured Listings</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {#if loading}
      {#each Array.from({length: 8}) as _, i}
        {@render skeleton()}
      {/each}
    {:else if listings.length === 0}
      <div class="col-span-full text-center py-8">
        <div class="text-gray-500">
          {searchQuery ? 'No listings found matching your search.' : 'No listings found.'}
        </div>
      </div>
    {:else}
      {#each listings as listing}
        <div class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
          <div class="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center relative">
            {#if listing.imageUrl}
              {@render imagePlaceholder()}
              <img 
                src={listing.imageUrl} 
                alt={listing.title} 
                class="object-cover w-full h-full transition-opacity duration-300 relative z-10"
                loading="lazy"
                width="400"
                height="225"
                decoding="async"
                onload={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.opacity = '1';
                  // Hide the placeholder when image loads
                  const placeholder = img.previousElementSibling as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = 'none';
                  }
                }}
                style="opacity: 0;"
              />
            {:else}
              <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
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
    {/if}
  </div>
</main>

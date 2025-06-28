<script lang="ts">
  import { onMount } from 'svelte';
  let listings: any[] = [];
  let loading = true;
  let search = '';
  let selectedCategory = 'All';
  let categories: string[] = ['All'];
  let hosts: any[] = [];
  let showCreateModal = false;
  let form = {
    title: '',
    description: '',
    price_per_guest: '',
    category: '',
    location: '',
    host_id: '',
    image: null as File | null
  };
  let creating = false;
  let errorMsg = '';
  let showCreateHostModal = false;
  let hostForm = {
    name: '',
    avatar: null as File | null
  };
  let creatingHost = false;
  let hostErrorMsg = '';

  async function getSignedUrl(key: string): Promise<string | null> {
    if (!key) return null;
    const res = await fetch(`/api/images?key=${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  }

  async function fetchListingsAndCategories() {
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
  }

  onMount(async () => {
    await fetchListingsAndCategories();
    // Fetch hosts
    const hostRes = await fetch('/api/hosts');
    hosts = await hostRes.json();
    loading = false;
  });

  $: filteredListings = listings.filter(l =>
    (selectedCategory === 'All' || l.category === selectedCategory) &&
    (l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()))
  );

  async function createListing(event: Event) {
    event.preventDefault();
    creating = true;
    errorMsg = '';
    try {
      // Create listing
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price_per_guest: Number(form.price_per_guest),
          host_id: Number(form.host_id),
          category: form.category,
          location: form.location
        })
      });
      if (!res.ok) throw new Error('Failed to create listing');
      const listing = await res.json();
      // Upload image if present
      if (form.image) {
        const imgForm = new FormData();
        imgForm.append('file', form.image);
        imgForm.append('listing_id', listing.id);
        await fetch('/api/images', { method: 'POST', body: imgForm });
      }
      // Refresh listings
      await fetchListingsAndCategories();
      showCreateModal = false;
      // Reset form
      form = { title: '', description: '', price_per_guest: '', category: '', location: '', host_id: '', image: null };
    } catch (e: any) {
      errorMsg = e.message || 'Error creating listing';
    } finally {
      creating = false;
    }
  }

  async function createHost(event: Event) {
    event.preventDefault();
    creatingHost = true;
    hostErrorMsg = '';
    try {
      // Create host
      const res = await fetch('/api/hosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: hostForm.name, avatar_url: null })
      });
      if (!res.ok) throw new Error('Failed to create host');
      // Optionally, upload avatar image (not implemented in backend yet)
      // Refresh hosts
      const hostRes = await fetch('/api/hosts');
      hosts = await hostRes.json();
      showCreateHostModal = false;
      hostForm = { name: '', avatar: null };
    } catch (e: any) {
      hostErrorMsg = e.message || 'Error creating host';
    } finally {
      creatingHost = false;
    }
  }
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

  <!-- Create Listing Button -->
  <div class="flex justify-end p-6">
    <button class="bg-pink-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-pink-600 transition" onclick={() => showCreateModal = true}>
      + Create Listing
    </button>
  </div>

  <!-- Create Listing Modal -->
  {#if showCreateModal}
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onclick={() => showCreateModal = false}>&times;</button>
        <h2 class="text-xl font-bold mb-4">Create Listing</h2>
        {#if errorMsg}
          <div class="text-red-500 mb-2">{errorMsg}</div>
        {/if}
        <form onsubmit={createListing} class="space-y-4">
          <input class="w-full border rounded px-3 py-2" placeholder="Title" bind:value={form.title} required />
          <textarea class="w-full border rounded px-3 py-2" placeholder="Description" bind:value={form.description} required></textarea>
          <input class="w-full border rounded px-3 py-2" placeholder="Location" bind:value={form.location} required />
          <input class="w-full border rounded px-3 py-2" type="number" placeholder="Price per guest" bind:value={form.price_per_guest} required min="1" />
          <select class="w-full border rounded px-3 py-2" bind:value={form.category} required>
            <option value="" disabled selected>Select category</option>
            {#each categories.filter(c => c !== 'All') as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
          <select class="w-full border rounded px-3 py-2" bind:value={form.host_id} required>
            <option value="" disabled selected>Select host</option>
            {#each hosts as host}
              <option value={host.id}>{host.name}</option>
            {/each}
          </select>
          <input class="w-full" type="file" accept="image/*" oninput={e => {
            const input = e.target as HTMLInputElement | null;
            form.image = input && input.files ? input.files[0] : null;
          }} />
          <button class="w-full bg-pink-500 text-white py-2 rounded font-semibold hover:bg-pink-600 transition" type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  {/if}

  <!-- Create Host Button -->
  <div class="flex justify-end px-6">
    <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold shadow hover:bg-gray-300 transition" onclick={() => showCreateHostModal = true}>
      + Create Host
    </button>
  </div>

  <!-- Create Host Modal -->
  {#if showCreateHostModal}
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onclick={() => showCreateHostModal = false}>&times;</button>
        <h2 class="text-xl font-bold mb-4">Create Host</h2>
        {#if hostErrorMsg}
          <div class="text-red-500 mb-2">{hostErrorMsg}</div>
        {/if}
        <form onsubmit={createHost} class="space-y-4">
          <input class="w-full border rounded px-3 py-2" placeholder="Name" bind:value={hostForm.name} required />
          <input class="w-full" type="file" accept="image/*" oninput={e => {
            const input = e.target as HTMLInputElement | null;
            hostForm.avatar = input && input.files ? input.files[0] : null;
          }} />
          <button class="w-full bg-gray-700 text-white py-2 rounded font-semibold hover:bg-gray-800 transition" type="submit" disabled={creatingHost}>
            {creatingHost ? 'Creating...' : 'Create Host'}
          </button>
        </form>
      </div>
    </div>
  {/if}
</main>

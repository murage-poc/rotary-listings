<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
  const { categories, hosts } = data;

  let form = $state({
    title: '',
    description: '',
    price_per_guest: '',
    category: '',
    location: '',
    host_id: '',
    image: null as File | null
  });
  let creating = $state(false);
  let errorMsg = $state('');

  async function createListing(event: Event) {
    event.preventDefault();
    creating = true;
    errorMsg = '';
    try {
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
      if (form.image) {
        const imgForm = new FormData();
        imgForm.append('file', form.image);
        imgForm.append('listing_id', listing.id);
        await fetch('/api/images', { method: 'POST', body: imgForm });
      }
      // Redirect to home page after successful creation
      goto('/');
    } catch (e: any) {
      errorMsg = e.message || 'Error creating listing';
    } finally {
      creating = false;
    }
  }
</script>

<main class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-2xl mx-auto">
    <header class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Create New Listing</h1>
          <p class="text-gray-600 mt-2">Add a new property to your air-bnb</p>
        </div>
        <button 
          onclick={() => goto('/admin')}
          class="text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Admin
        </button>
      </div>
    </header>

    <div class="bg-white rounded-lg shadow-md p-8">
      {#if errorMsg}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errorMsg}
        </div>
      {/if}

      <form onsubmit={createListing} class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
            placeholder="Enter listing title" 
            bind:value={form.title} 
            required 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
            placeholder="Describe your property" 
            bind:value={form.description} 
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
            placeholder="Enter property location" 
            bind:value={form.location} 
            required 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Price per Guest</label>
          <input 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
            type="number" 
            placeholder="Enter price per guest" 
            bind:value={form.price_per_guest} 
            required 
            min="1" 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
            bind:value={form.category} 
            required
          >
            <option value="" disabled selected>Select category</option>
            {#if categories}
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            {/if}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Host</label>
          <select 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
            bind:value={form.host_id} 
            required
          >
            <option value="" disabled selected>Select host</option>
            {#if hosts}
              {#each hosts as host}
                <option value={host.id}>{host.name}</option>
              {/each}
            {/if}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Property Image</label>
          <input 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
            type="file" 
            accept="image/*" 
            oninput={e => {
              const input = e.target as HTMLInputElement | null;
              form.image = input && input.files ? input.files[0] : null;
            }} 
          />
        </div>

        <div class="flex gap-4">
          <button 
            type="submit" 
            disabled={creating}
            class="flex-1 bg-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-600 transition disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Listing'}
          </button>
          <button 
            type="button"
            onclick={() => goto('/admin')}
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</main> 
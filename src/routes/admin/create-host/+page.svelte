<script lang="ts">
  import { goto } from '$app/navigation';

  let hostForm = $state({ name: '', avatar: null as File | null });
  let creatingHost = $state(false);
  let hostErrorMsg = $state('');

  async function createHost(event: Event) {
    event.preventDefault();
    creatingHost = true;
    hostErrorMsg = '';
    try {
      const res = await fetch('/api/hosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: hostForm.name, avatar_url: null })
      });
      if (!res.ok) throw new Error('Failed to create host');
      // Redirect to admin dashboard after successful creation
      goto('/admin');
    } catch (e: any) {
      hostErrorMsg = e.message || 'Error creating host';
    } finally {
      creatingHost = false;
    }
  }
</script>

<main class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-2xl mx-auto">
    <header class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Create New Host</h1>
          <p class="text-gray-600 mt-2">Add a new host to your air-bnb</p>
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
      {#if hostErrorMsg}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {hostErrorMsg}
        </div>
      {/if}

      <form onsubmit={createHost} class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Host Name</label>
          <input 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Enter host name" 
            bind:value={hostForm.name} 
            required 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Profile Image (Optional)</label>
          <input 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            type="file" 
            accept="image/*" 
            oninput={e => {
              const input = e.target as HTMLInputElement | null;
              hostForm.avatar = input && input.files ? input.files[0] : null;
            }} 
          />
        </div>

        <div class="flex gap-4">
          <button 
            type="submit" 
            disabled={creatingHost}
            class="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {creatingHost ? 'Creating...' : 'Create Host'}
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
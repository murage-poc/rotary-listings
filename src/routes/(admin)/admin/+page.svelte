<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<main class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-4xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600 mt-2">Manage your air-bnb listings and hosts</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Create Listing Card -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Create Listing</h2>
            <p class="text-gray-600">Add a new property listing</p>
          </div>
        </div>
        <button 
          onclick={() => goto('/admin/create-listing')}
          class="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition"
        >
          Create New Listing
        </button>
      </div>

      <!-- Create Host Card -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Create Host</h2>
            <p class="text-gray-600">Add a new host account</p>
          </div>
        </div>
        <button 
          onclick={() => goto('/admin/create-host')}
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Create New Host
        </button>
      </div>

      <!-- Create Category Card -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Create Category</h2>
            <p class="text-gray-600">Add a new category with icon</p>
          </div>
        </div>
        <button 
          onclick={() => goto('/admin/create-category')}
          class="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
        >
          Create New Category
        </button>
      </div>
    </div>

    <!-- Back to Home -->
    <div class="mt-8 text-center">
      <button 
        onclick={() => goto('/')}
        class="text-gray-600 hover:text-gray-900 transition"
      >
        ← Back to Home
      </button>
    </div>
  </div>
</main> 
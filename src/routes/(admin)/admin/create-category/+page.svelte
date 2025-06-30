<script lang="ts">
  import { CategoryFormController } from './category-form-controller.svelte';
  let controller = new CategoryFormController();
  let fileInput: HTMLInputElement;
  
  function handleFileSelect() {
    if (fileInput?.files) {
      controller.handleFileUpload(fileInput.files);
    }
  }
</script>

<svelte:head>
  <title>Create Category - Admin</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-2xl mx-auto">
    <header class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Create New Category</h1>
          <p class="text-gray-600 mt-2">Add a new category to your air-bnb</p>
        </div>
        <button 
          on:click={() => window.location.href = '/admin'}
          class="text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Admin
        </button>
      </div>
    </header>

    <div class="bg-white rounded-lg shadow-md p-8">
      {#if controller.errorMessage}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {controller.errorMessage}
        </div>
      {/if}

      <form on:submit={controller.handleSubmit.bind(controller)} class="space-y-6">
        <div>
          <label for="category-name" class="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
          <input
            id="category-name"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter category name"
            bind:value={controller.categoryName}
            required
          />
        </div>

        <div>
          <label for="category-icon-upload" class="block text-sm font-medium text-gray-700 mb-2">Category Icon (SVG)</label>
          <!-- Icon Display -->
          {#if controller.iconSvg}
            <div class="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Current Icon:</span>
                <button
                  type="button"
                  on:click={controller.removeIcon.bind(controller)}
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div class="flex items-center justify-center h-16 bg-white rounded border">
                {@html controller.iconSvg}
              </div>
            </div>
          {/if}

          <!-- Drag & Drop Zone with Buttons -->
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors {controller.isDragOver ? 'border-pink-500 bg-pink-50' : ''} mt-2"
            on:dragover={controller.handleDragOver.bind(controller)}
            on:dragleave={controller.handleDragLeave.bind(controller)}
            on:drop={controller.handleDrop.bind(controller)}
            on:keydown={controller.handleKeyDown.bind(controller)}
            tabindex="0"
            role="button"
            aria-label="Drop SVG file here or use the buttons below"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="mt-4 flex flex-col sm:flex-row justify-center gap-3">
              <label class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <input
                  id="category-icon-upload"
                  bind:this={fileInput}
                  type="file"
                  accept=".svg"
                  on:change={handleFileSelect}
                  class="hidden"
                />
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                Choose File
              </label>
              <button
                type="button"
                on:click={controller.handlePasteButton.bind(controller)}
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Paste SVG
              </button>
            </div>
            <div class="mt-2 text-xs text-gray-500">Drag & drop, select, or paste an SVG icon</div>
          </div>

          <!-- Paste Area -->
          {#if controller.showPasteArea}
            <div class="mt-4">
              <label for="pasteArea" class="block text-sm font-medium text-gray-700 mb-2">
                Paste your SVG here:
              </label>
              <textarea
                id="pasteArea"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                bind:value={controller.iconSvg}
                on:paste={controller.handlePaste.bind(controller)}
                rows="6"
                placeholder="Paste your SVG code here..."
              ></textarea>
            </div>
          {/if}
        </div>

        <div class="flex gap-4">
          <button 
            type="submit" 
            disabled={controller.isSubmitting}
            class="flex-1 bg-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-600 transition disabled:opacity-50"
          >
            {controller.isSubmitting ? 'Creating...' : 'Create Category'}
          </button>
          <button 
            type="button"
            on:click={() => window.location.href = '/admin'}
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</main> 
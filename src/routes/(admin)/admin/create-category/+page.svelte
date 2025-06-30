<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  let categoryName = '';
  let iconSvg = '';
  let isSubmitting = false;
  let errorMessage = '';
  let successMessage = '';

  // Basic SVG validation
  function validateSvg(svg: string): boolean {
    if (!svg.trim()) return true; // Empty is OK (optional)
    
    const svgRegex = /^<svg[^>]*>.*<\/svg>$/is;
    if (!svgRegex.test(svg)) {
      errorMessage = 'Invalid SVG format. Please provide a valid SVG element.';
      return false;
    }

    // Check for potentially dangerous content
    const dangerousPatterns = [
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /<script/i,
      /on\w+\s*=/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(svg)) {
        errorMessage = 'SVG contains forbidden content. Please use a safe SVG.';
        return false;
      }
    }

    return true;
  }

  function handleSvgChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    iconSvg = target.value;
    errorMessage = '';
    
    if (iconSvg && !validateSvg(iconSvg)) {
      return;
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!categoryName.trim()) {
      errorMessage = 'Category name is required.';
      return;
    }

    if (iconSvg && !validateSvg(iconSvg)) {
      return;
    }

    isSubmitting = true;
    errorMessage = '';
    successMessage = '';

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryName.trim(),
          icon_svg: iconSvg.trim() || null
        })
      });

      if (response.ok) {
        successMessage = 'Category created successfully!';
        categoryName = '';
        iconSvg = '';
        // Reset form
        const form = event.target as HTMLFormElement;
        form.reset();
      } else {
        const error = await response.json();
        errorMessage = error.message || 'Failed to create category.';
      }
    } catch (error) {
      errorMessage = 'Network error. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<main class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-2xl mx-auto">
    <header class="mb-8">
      <button 
        onclick={() => goto('/admin')}
        class="text-gray-600 hover:text-gray-900 transition mb-4 flex items-center"
      >
        ← Back to Admin
      </button>
      <h1 class="text-3xl font-bold text-gray-900">Create New Category</h1>
      <p class="text-gray-600 mt-2">Add a new category with an optional custom icon</p>
    </header>

    <div class="bg-white rounded-lg shadow-md p-6">
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Category Name -->
        <div>
          <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            id="categoryName"
            bind:value={categoryName}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Beachfront, Cabins, Luxe"
            required
          />
        </div>

        <!-- SVG Icon -->
        <div>
          <label for="iconSvg" class="block text-sm font-medium text-gray-700 mb-2">
            SVG Icon (Optional)
          </label>
          <textarea
            id="iconSvg"
            bind:value={iconSvg}
            oninput={handleSvgChange}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            rows="6"
            placeholder="<svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>...</svg>"
          />
          <p class="text-xs text-gray-500 mt-1">
            Paste a valid SVG code. Only safe SVG elements are allowed.
          </p>
        </div>

        <!-- Icon Preview -->
        {#if iconSvg && validateSvg(iconSvg)}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Icon Preview
            </label>
            <div class="border border-gray-200 rounded-md p-4 bg-gray-50 flex items-center justify-center">
              <div class="w-8 h-8 text-gray-600">
                {@html iconSvg}
              </div>
            </div>
          </div>
        {/if}

        <!-- Error Message -->
        {#if errorMessage}
          <div class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <span class="text-red-700">{errorMessage}</span>
            </div>
          </div>
        {/if}

        <!-- Success Message -->
        {#if successMessage}
          <div class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-green-700">{successMessage}</span>
            </div>
          </div>
        {/if}

        <!-- Submit Button -->
        <div class="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            class="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </button>
          <button
            type="button"
            onclick={() => goto('/admin')}
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Help Section -->
    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-3">SVG Icon Guidelines</h3>
      <ul class="text-sm text-blue-800 space-y-2">
        <li>• Use simple, clean SVG designs that work well at small sizes (32x32px)</li>
        <li>• Include viewBox, width, height, and xmlns attributes</li>
        <li>• Use standard SVG elements: svg, path, circle, rect, ellipse, line, polyline, polygon, g</li>
        <li>• Avoid scripts, external links, or complex animations</li>
        <li>• Test your icon at different sizes to ensure it remains clear</li>
      </ul>
    </div>
  </div>
</main> 
<script lang="ts">
  import { goto } from '$app/navigation';

  let categoryName = '';
  let iconSvg = '';
  let isSubmitting = false;
  let errorMessage = '';
  let successMessage = '';
  let isDragOver = false;
  let showPasteArea = false;

  // Basic SVG validation
  function validateSvg(svg: string): boolean {
    if (!svg.trim()) return false; // Icon is required
    
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
    iconSvg = target.value?.trim();
    errorMessage = '';
    
    if (iconSvg && !validateSvg(iconSvg)) {
      return;
    }
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (!file.name.toLowerCase().endsWith('.svg')) {
      errorMessage = 'Please select an SVG file.';
      return;
    }
    
    try {
      const text = await file.text();
      iconSvg = text?.trim();
      errorMessage = '';
      
      if (!validateSvg(iconSvg)) {
        return;
      }
    } catch (error) {
      errorMessage = 'Error reading file. Please try again.';
    }
  }

  function handleDragOver(event: Event) {
    event.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave(event: Event) {
    event.preventDefault();
    isDragOver = false;
  }

  function handleDrop(event: Event) {
    event.preventDefault();
    isDragOver = false;
    
    const dragEvent = event as DragEvent;
    const files = dragEvent.dataTransfer?.files;
    handleFileUpload(files || null);
  }

  async function handlePasteButton() {
    showPasteArea = true;
    
    // Try to read clipboard automatically
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText && clipboardText.trim()) {
        iconSvg = clipboardText.trim();
        errorMessage = '';
        
        if (!validateSvg(iconSvg)) {
          return;
        }
      }
    } catch (error) {
      // Clipboard API might not be available or user denied permission
      // That's okay, user can still paste manually
    }
  }

  function handlePaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text');
    if (pastedText) {
      iconSvg = pastedText.trim();
      errorMessage = '';
      
      if (!validateSvg(iconSvg)) {
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    // Handle Ctrl+V on the dropzone
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      event.preventDefault();
      handlePasteButton();
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!categoryName.trim()) {
      errorMessage = 'Category name is required.';
      return;
    }

    if (!iconSvg.trim()) {
      errorMessage = 'Icon is required.';
      return;
    }

    if (!validateSvg(iconSvg)) {
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
          icon_svg: iconSvg.trim()
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
      <p class="text-gray-600 mt-2">Add a new category with an icon</p>
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

        <!-- Icon Upload Area -->
        <div>
          <label for="iconUpload" class="block text-sm font-medium text-gray-700 mb-2">
            Icon *
          </label>
          
          {#if !iconSvg}
            <!-- Upload Options -->
            <div class="space-y-4">
              <!-- Drag & Drop Area -->
              <div
                class="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all duration-200 hover:border-green-400 hover:bg-green-50 {isDragOver ? 'border-green-500 bg-green-50' : ''}"
                ondragover={handleDragOver}
                ondragleave={handleDragLeave}
                ondrop={handleDrop}
                onkeydown={handleKeyDown}
                role="button"
                tabindex="0"
                id="iconUpload"
                aria-label="Upload SVG icon by dragging and dropping a file or pressing Ctrl+V to paste"
              >
                <div class="space-y-4">
                  <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-700">Drop your SVG file here</p>
                    <p class="text-xs text-gray-500 mt-1">or press Ctrl+V to paste SVG code</p>
                  </div>
                  <div class="flex gap-3 justify-center">
                    <label class="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-sm font-medium">
                      Choose File
                      <input
                        type="file"
                        accept=".svg"
                        class="hidden"
                        onchange={(e) => {
                          const target = e.target as HTMLInputElement;
                          handleFileUpload(target.files);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onclick={handlePasteButton}
                      class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm font-medium"
                    >
                      Paste SVG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {:else}
            <!-- Icon Preview & Edit -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-gray-700">Icon Preview</span>
                <button
                  type="button"
                  onclick={() => { iconSvg = ''; showPasteArea = false; }}
                  class="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <div class="flex items-center justify-center p-4 bg-white rounded border">
                <div class="w-12 h-12 text-gray-600">
                  {@html iconSvg}
                </div>
              </div>
              {#if showPasteArea}
                <div class="mt-4">
                  <textarea
                    bind:value={iconSvg}
                    oninput={handleSvgChange}
                    onpaste={handlePaste}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-xs"
                    rows="4"
                    placeholder="Paste your SVG code here..."
                  ></textarea>
                </div>
              {/if}
            </div>
          {/if}
        </div>

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
            disabled={isSubmitting || !iconSvg.trim()}
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
      <h3 class="text-lg font-semibold text-blue-900 mb-3">SVG Guidelines</h3>
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
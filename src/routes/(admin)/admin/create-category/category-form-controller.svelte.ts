import { goto } from '$app/navigation';

export class CategoryFormController {
  categoryName = $state('');
  iconSvg = $state('');
  isSubmitting = $state(false);
  errorMessage = $state('');
  isDragOver = $state(false);
  showPasteArea = $state(false);

  // Basic SVG validation
  private validateSvg(svg: string): boolean {
    if (!svg.trim()) return false;
    const svgRegex = /^<svg[^>]*>.*<\/svg>$/is;
    if (!svgRegex.test(svg)) return false;
    const dangerousPatterns = [
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /<script/i,
      /on\w+\s*=/i
    ];
    for (const pattern of dangerousPatterns) {
      if (pattern.test(svg)) return false;
    }
    return true;
  }

  async handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.svg')) {
      this.errorMessage = 'Please select an SVG file.';
      return;
    }
    try {
      const text = await file.text();
      this.iconSvg = text?.trim();
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Error reading file. Please try again.';
    }
  }

  handleDragOver(event: Event) {
    event.preventDefault();
    this.isDragOver = true;
  }

  handleDragLeave(event: Event) {
    event.preventDefault();
    this.isDragOver = false;
  }

  handleDrop(event: Event) {
    event.preventDefault();
    this.isDragOver = false;
    const dragEvent = event as DragEvent;
    const files = dragEvent.dataTransfer?.files;
    this.handleFileUpload(files || null);
  }

  async handlePasteButton() {
    this.showPasteArea = true;
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText && clipboardText.trim()) {
        this.iconSvg = clipboardText.trim();
        this.errorMessage = '';
      }
    } catch (error) {
      // Clipboard API might not be available or user denied permission
    }
  }

  handlePaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text');
    if (pastedText) {
      this.iconSvg = pastedText.trim();
      this.errorMessage = '';
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      event.preventDefault();
      this.handlePasteButton();
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    if (!this.categoryName.trim()) {
      this.errorMessage = 'Category name is required.';
      return;
    }
    if (!this.iconSvg.trim()) {
      this.errorMessage = 'Icon is required.';
      return;
    }
    if (!this.validateSvg(this.iconSvg)) {
      this.errorMessage = 'Invalid SVG format or contains forbidden content.';
      return;
    }
    this.isSubmitting = true;
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.categoryName.trim(),
          icon_svg: this.iconSvg.trim()
        })
      });
      if (response.ok) {
        goto('/admin?success=Category created successfully!');
      } else {
        const error = await response.json();
        this.errorMessage = error.message || 'Failed to create category.';
      }
    } catch (error) {
      this.errorMessage = 'Network error. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  removeIcon() {
    this.iconSvg = '';
    this.showPasteArea = false;
  }

  clearError() {
    this.errorMessage = '';
  }
} 
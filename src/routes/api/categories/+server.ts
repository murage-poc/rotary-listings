import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import DOMPurify from 'isomorphic-dompurify';

export const GET: RequestHandler = async () => {
  const categories = await db
    .selectFrom('categories')
    .select(['name', 'icon_svg'])
    .execute();
  
  return json(categories);
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const { name, icon_svg } = data;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw error(400, 'Category name is required');
  }

  const trimmedName = name.trim();
  
  // Check if category already exists
  const existing = await db
    .selectFrom('categories')
    .select('id')
    .where('name', '=', trimmedName)
    .executeTakeFirst();
    
  if (existing) {
    throw error(409, 'Category already exists');
  }

  // Validate and sanitize SVG if provided
  let sanitizedIconSvg = null;
  if (icon_svg && typeof icon_svg === 'string') {
    // Basic SVG validation
    const svgRegex = /^<svg[^>]*>.*<\/svg>$/is;
    if (!svgRegex.test(icon_svg)) {
      throw error(400, 'Invalid SVG format');
    }

    // Sanitize the SVG using DOMPurify
    sanitizedIconSvg = DOMPurify.sanitize(icon_svg, {
      ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'g'],
      ALLOWED_ATTR: [
        'viewBox', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 
        'stroke-linejoin', 'd', 'cx', 'cy', 'r', 'x', 'y', 'rx', 'ry', 'points', 'x1', 'y1', 'x2', 'y2',
        'class', 'xmlns'
      ],
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'style', 'link', 'meta', 'title'],
      FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur']
    });

    // Additional security check - ensure no script-like content
    if (sanitizedIconSvg.toLowerCase().includes('javascript:') || 
        sanitizedIconSvg.toLowerCase().includes('data:text/html') ||
        sanitizedIconSvg.toLowerCase().includes('vbscript:')) {
      throw error(400, 'SVG contains forbidden content');
    }
  }

  const inserted = await db
    .insertInto('categories')
    .values({ 
      name: trimmedName,
      icon_svg: sanitizedIconSvg
    })
    .returningAll()
    .executeTakeFirst();
    
  return json(inserted);
}; 
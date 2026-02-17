/**
 * Shared utility to resolve the best product image source
 * Handles data URLs, static paths, and fallback placeholder
 */

import { getProductImagePath } from './productImages';

interface ProductImageInput {
  imgPath: string;
  brand: string;
  name: string;
}

const FALLBACK_IMAGE = '/assets/generated/product-placeholders-set.dim_1200x800.png';

/**
 * Resolves the best image source for a product
 * Priority: explicit imgPath (including data URLs) > mapped static image > fallback
 */
export function resolveProductImage(product: ProductImageInput): string {
  // Trim and check for valid imgPath
  const trimmedPath = product.imgPath?.trim() || '';
  
  // Prefer explicit imgPath if non-empty (includes data URLs from uploads)
  if (trimmedPath && trimmedPath !== '' && trimmedPath !== 'placeholder') {
    return trimmedPath;
  }
  
  // Try mapped static image
  const mappedImage = getProductImagePath({ brand: product.brand, name: product.name });
  if (mappedImage) {
    return mappedImage;
  }
  
  // Fallback placeholder
  return FALLBACK_IMAGE;
}

/**
 * Returns the fallback image path
 */
export function getFallbackImage(): string {
  return FALLBACK_IMAGE;
}

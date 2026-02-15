/**
 * Uploaded product images available for selection
 * These are the standardized square product images uploaded by the user
 */

export interface UploadedImage {
  path: string;
  label: string;
}

export const UPLOADED_PRODUCT_IMAGES: UploadedImage[] = [
  {
    path: '/assets/generated/uploaded-product-1.dim_800x800.png',
    label: 'Turtle Wax Rubbing Compound',
  },
  {
    path: '/assets/generated/uploaded-product-2.dim_800x800.png',
    label: 'Turtle Wax Ceramic Wash & Wax',
  },
  {
    path: '/assets/generated/uploaded-product-3.dim_800x800.png',
    label: 'Turtle Wax Ice Seal N Shine',
  },
  {
    path: '/assets/generated/uploaded-product-4.dim_800x800.png',
    label: 'Turtle Wax Rapid Decon Iron Remover',
  },
];

/**
 * Get all available uploaded image paths
 */
export function getUploadedImagePaths(): string[] {
  return UPLOADED_PRODUCT_IMAGES.map((img) => img.path);
}

/**
 * Check if a path is an uploaded product image
 */
export function isUploadedProductImage(path: string): boolean {
  return UPLOADED_PRODUCT_IMAGES.some((img) => img.path === path);
}

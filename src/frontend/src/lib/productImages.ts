/**
 * Product image mapping for original products
 * Maps product identifiers to their static image paths
 */

interface ProductIdentifier {
  brand: string;
  name: string;
}

const productImageMap: Record<string, string> = {
  // 3M Products
  '3M|3M 1080 Film': '/assets/generated/product-3m-1080-film.dim_800x800.png',
  '3M|3M Velcro Tape': '/assets/generated/product-3m-velcro-tape.dim_800x800.png',
  '3M|3M Wire Harness Tape': '/assets/generated/product-3m-wire-harness-tape.dim_800x800.png',
  
  // Turtle Wax Products
  'Turtle Wax|Turtle Wax Rubbing Compound': '/assets/generated/product-turtle-wax-rubbing-compound.dim_800x800.png',
  'Turtle Wax|Turtle Wax Ceramic Car Wash': '/assets/generated/product-turtle-wax-ceramic-car-wash.dim_800x800.png',
  'Turtle Wax|Turtle Wax All Wheel Cleaner': '/assets/generated/product-turtle-wax-all-wheel-cleaner.dim_800x800.png',
  'Turtle Wax|Turtle Wax Ice Spray Wax': '/assets/generated/product-turtle-wax-ice-spray-wax.dim_800x800.png',
};

/**
 * Get the static image path for an original product
 * Returns the mapped image path or undefined if not found
 */
export function getProductImagePath(product: ProductIdentifier): string | undefined {
  const key = `${product.brand}|${product.name}`;
  return productImageMap[key];
}

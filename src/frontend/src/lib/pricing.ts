/**
 * Pricing utilities for product display
 */

/**
 * Format INR amount with rupee symbol
 */
export function formatINR(amount: bigint): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Calculate discount percentage between MRP and selling price
 */
export function calculateDiscountPercentage(mrp: bigint, sellingPrice: bigint): number {
  if (mrp === 0n) return 0;
  const discount = Number(mrp - sellingPrice);
  const percentage = (discount / Number(mrp)) * 100;
  return Math.round(percentage);
}

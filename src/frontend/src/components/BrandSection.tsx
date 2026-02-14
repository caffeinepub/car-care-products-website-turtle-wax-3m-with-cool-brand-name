import type { Product } from '../backend';
import { ProductCard } from './ProductCard';

interface BrandSectionProps {
  brand: string;
  products: Product[];
}

export function BrandSection({ brand, products }: BrandSectionProps) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {brand} Products
        </h2>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id.toString()} product={product} />
        ))}
      </div>
    </div>
  );
}

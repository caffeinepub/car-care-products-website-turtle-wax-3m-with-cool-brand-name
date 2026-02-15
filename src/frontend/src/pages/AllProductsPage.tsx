import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '../components/EmptyState';
import { useNavigate } from '@tanstack/react-router';
import { Package } from 'lucide-react';

export default function AllProductsPage() {
  const navigate = useNavigate();
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Error Loading Products"
          description="We couldn't load the products. Please try again later."
          actionLabel="Go Home"
          onAction={() => navigate({ to: '/' })}
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="No Products Available"
          description="There are no products available at the moment. Check back soon!"
          actionLabel="Go Home"
          onAction={() => navigate({ to: '/' })}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              All Products
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse our complete collection of {products.length} premium car care products
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id.toString()} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

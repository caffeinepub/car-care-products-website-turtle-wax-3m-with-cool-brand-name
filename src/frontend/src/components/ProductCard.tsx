import { useState } from 'react';
import type { Product } from '../backend';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '@/lib/pricing';
import { getProductImagePath } from '@/lib/productImages';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const fallbackImage = '/assets/generated/product-placeholders-set.dim_1200x800.png';
  
  // Try to get the original product image first, then use product.imgPath, then fallback
  const originalImage = getProductImagePath({ brand: product.brand, name: product.name });
  const initialImage = originalImage || product.imgPath || fallbackImage;
  
  const [imageSrc, setImageSrc] = useState(initialImage);

  const handleImageError = () => {
    setImageSrc(fallbackImage);
  };

  // Use backend pricing: originalMrp as display MRP, discountedPrice as selling price
  const displayMrp = product.originalMrp;
  const sellingPrice = product.discountedPrice;

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-muted/50">
        <img
          src={imageSrc}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight text-card-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="space-y-1 pt-2 border-t border-border/50">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">MRP:</span>
            <span className="text-sm font-medium text-muted-foreground line-through">
              {formatINR(displayMrp)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">Selling Price:</span>
            <span className="text-xl font-bold text-primary">
              {formatINR(sellingPrice)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

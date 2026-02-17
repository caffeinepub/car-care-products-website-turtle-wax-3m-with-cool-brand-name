import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Product } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { formatINR } from '@/lib/pricing';
import { getProductImagePath } from '@/lib/productImages';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const fallbackImage = '/assets/generated/product-placeholders-set.dim_1200x800.png';
  
  // Prefer explicit imgPath if non-empty, then mapped image, then fallback
  const mappedImage = getProductImagePath({ brand: product.brand, name: product.name });
  const initialImage = (product.imgPath && product.imgPath.trim() !== '') 
    ? product.imgPath 
    : (mappedImage || fallbackImage);
  
  const [imageSrc, setImageSrc] = useState(initialImage);
  const isWishlisted = isInWishlist(product.id);

  const handleImageError = () => {
    setImageSrc(fallbackImage);
  };

  const handleViewProduct = () => {
    navigate({ to: '/product/$id', params: { id: product.id.toString() } });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success('Added to cart', {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem(product);
    if (isWishlisted) {
      toast.success('Removed from wishlist', {
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      toast.success('Added to wishlist', {
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const displayMrp = product.originalMrp;
  const sellingPrice = product.discountedPrice;

  return (
    <div 
      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={handleViewProduct}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isWishlisted ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        />
      </button>

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

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1" 
            variant="default"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleViewProduct();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

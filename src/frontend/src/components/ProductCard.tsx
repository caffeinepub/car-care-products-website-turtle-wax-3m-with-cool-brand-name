import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatINR, calculateDiscountPercentage } from '@/lib/pricing';
import { resolveProductImage, getFallbackImage } from '@/lib/resolveProductImage';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import type { Product } from '../backend';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const isInWishlistFlag = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercentage(
    product.originalMrp,
    product.discountedPrice
  );

  const imageSrc = resolveProductImage({
    imgPath: product.imgPath || '',
    brand: product.brand,
    name: product.name,
  });

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
    if (!isInWishlistFlag) {
      toast.success('Added to wishlist', {
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleCardClick = () => {
    navigate({ to: '/product/$id', params: { id: product.id.toString() } });
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/50">
          <img
            src={imageSrc}
            alt={product.name}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== getFallbackImage()) {
                target.src = getFallbackImage();
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercent > 0 && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-bold">
              {discountPercent}% OFF
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background ${
              isInWishlistFlag ? 'text-primary' : ''
            }`}
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-5 w-5 ${isInWishlistFlag ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-3">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {product.brand}
            </Badge>
            <h3 className="font-semibold text-lg leading-tight text-card-foreground line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.shortDescription}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatINR(product.discountedPrice)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(product.originalMrp)}
            </span>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

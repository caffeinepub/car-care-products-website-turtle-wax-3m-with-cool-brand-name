import { useParams, useNavigate } from '@tanstack/react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { formatINR, calculateDiscountPercentage } from '@/lib/pricing';
import { resolveProductImage, getFallbackImage } from '@/lib/resolveProductImage';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(BigInt(id));
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

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

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success('Added to cart', {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    if (!isInWishlistFlag) {
      toast.success('Added to wishlist', {
        description: `${product.name} has been added to your wishlist.`,
      });
    } else {
      toast.success('Removed from wishlist');
    }
  };

  const handleBuyNow = () => {
    navigate({
      to: '/checkout',
      search: { mode: 'single', productId: product.id.toString() },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate({ to: '/' })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted/50">
                  <img
                    src={imageSrc}
                    alt={product.name}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== getFallbackImage()) {
                        target.src = getFallbackImage();
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary" className="text-sm">
                {product.brand}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {product.shortDescription}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator />

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  {formatINR(product.discountedPrice)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatINR(product.originalMrp)}
                </span>
                {discountPercent > 0 && (
                  <Badge className="bg-accent text-accent-foreground font-bold">
                    {discountPercent}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={isInWishlistFlag ? 'text-primary border-primary' : ''}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlistFlag ? 'fill-current' : ''}`}
                  />
                </Button>
              </div>
              <Button size="lg" variant="secondary" className="w-full" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

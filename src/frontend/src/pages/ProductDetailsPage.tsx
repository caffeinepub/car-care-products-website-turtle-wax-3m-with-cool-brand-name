import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '../components/EmptyState';
import { formatINR, calculateDiscountPercentage } from '@/lib/pricing';
import { getProductImagePath } from '@/lib/productImages';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const productId = BigInt(id);
  
  const { data: product, isLoading, isError } = useProduct(productId);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const fallbackImage = '/assets/generated/product-placeholders-set.dim_1200x800.png';
  
  // Prefer explicit imgPath if non-empty, then mapped image, then fallback
  const mappedImage = product ? getProductImagePath({ brand: product.brand, name: product.name }) : undefined;
  const initialImage = (product?.imgPath && product.imgPath.trim() !== '')
    ? product.imgPath
    : (mappedImage || fallbackImage);
  
  const [imageSrc, setImageSrc] = useState(initialImage);
  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (product) {
      const newMappedImage = getProductImagePath({ brand: product.brand, name: product.name });
      const newImage = (product.imgPath && product.imgPath.trim() !== '')
        ? product.imgPath
        : (newMappedImage || fallbackImage);
      setImageSrc(newImage);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Urban Wax Studio`;
    }
  }, [product]);

  const handleImageError = () => {
    setImageSrc(fallbackImage);
  };

  const handleBuyNow = () => {
    navigate({ to: '/checkout', search: { productId: id } });
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1);
      toast.success('Added to cart', {
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
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
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Product Not Found"
          description="The product you're looking for doesn't exist or has been removed."
          actionLabel="Back to Home"
          onAction={() => navigate({ to: '/' })}
        />
      </div>
    );
  }

  const discountPercentage = calculateDiscountPercentage(
    product.originalMrp,
    product.discountedPrice
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate({ to: '/' })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted/50">
              <img
                src={imageSrc}
                alt={product.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand */}
            <Badge variant="secondary" className="text-sm">
              {product.brand}
            </Badge>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-3 p-6 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-muted-foreground">MRP:</span>
                <span className="text-xl font-medium text-muted-foreground line-through">
                  {formatINR(product.originalMrp)}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-muted-foreground">Selling Price:</span>
                <span className="text-4xl font-bold text-primary">
                  {formatINR(product.discountedPrice)}
                </span>
                {discountPercentage > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant={isWishlisted ? 'default' : 'outline'}
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`}
                  />
                </Button>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

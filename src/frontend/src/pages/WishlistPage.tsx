import { useNavigate } from '@tanstack/react-router';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '../components/EmptyState';
import { formatINR } from '@/lib/pricing';
import { resolveProductImage, getFallbackImage } from '@/lib/resolveProductImage';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (productId: bigint) => {
    const product = items.find((item) => item.id === productId);
    if (product) {
      addItem(product, 1);
      removeItem(productId);
      toast.success('Moved to cart', {
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Your Wishlist is Empty"
          description="Save your favorite products to your wishlist for easy access later."
          actionLabel="Browse Products"
          onAction={() => navigate({ to: '/' })}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            My Wishlist
          </h1>
          <Badge variant="secondary" className="ml-2">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => {
            const imageSrc = resolveProductImage({
              imgPath: product.imgPath || '',
              brand: product.brand,
              name: product.name,
            });

            return (
              <Card key={product.id.toString()} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div 
                    className="aspect-square overflow-hidden bg-muted/50 cursor-pointer"
                    onClick={() => navigate({ to: '/product/$id', params: { id: product.id.toString() } })}
                  >
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
                  </div>

                  {/* Product Info */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.brand}
                      </Badge>
                      <h3 
                        className="font-semibold text-lg leading-tight text-card-foreground cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate({ to: '/product/$id', params: { id: product.id.toString() } })}
                      >
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-muted-foreground line-through">
                          {formatINR(product.originalMrp)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {formatINR(product.discountedPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleMoveToCart(product.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatINR } from '@/lib/pricing';
import { getProductImagePath } from '@/lib/productImages';
import { CheckCircle2, Minus, Plus, AlertCircle } from 'lucide-react';

type PaymentMethod = 'upi' | 'card' | 'cod';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/checkout' }) as { productId?: string; mode?: string };
  const isCartMode = search.mode === 'cart';
  const productId = search.productId ? BigInt(search.productId) : undefined;

  const { data: product, isLoading } = useProduct(productId);
  const { items: cartItems, getTotal: getCartTotal, clearCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  // Delivery address state
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const fallbackImage = '/assets/generated/product-placeholders-set.dim_1200x800.png';

  useEffect(() => {
    document.title = 'Checkout - Urban Wax Studio';
  }, []);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields including delivery address
    if (
      !fullName.trim() || 
      !email.trim() || 
      !paymentMethod ||
      !addressLine1.trim() ||
      !city.trim() ||
      !stateProvince.trim() ||
      !postalCode.trim() ||
      !country.trim()
    ) {
      setShowValidationError(true);
      return;
    }

    setShowValidationError(false);
    setOrderPlaced(true);
    
    // Clear cart only if in cart mode
    if (isCartMode) {
      clearCart();
    }
  };

  // Calculate total based on mode
  const calculateTotal = () => {
    if (isCartMode) {
      return getCartTotal();
    } else if (product) {
      return Number(product.discountedPrice) * quantity;
    }
    return 0;
  };

  const total = calculateTotal();

  // Check if form is valid
  const isFormValid = 
    fullName.trim() && 
    email.trim() && 
    addressLine1.trim() &&
    city.trim() &&
    stateProvince.trim() &&
    postalCode.trim() &&
    country.trim();

  // Loading state
  if (!isCartMode && isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // Error state for single product mode
  if (!isCartMode && !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Product Not Found"
          description="The product you're trying to checkout doesn't exist."
          actionLabel="Back to Home"
          onAction={() => navigate({ to: '/' })}
        />
      </div>
    );
  }

  // Error state for cart mode
  if (isCartMode && cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Cart is Empty"
          description="Your cart is empty. Add some products before checking out."
          actionLabel="Browse Products"
          onAction={() => navigate({ to: '/' })}
        />
      </div>
    );
  }

  // Order confirmation state
  if (orderPlaced) {
    const paymentMethodLabels: Record<PaymentMethod, string> = {
      upi: 'UPI',
      card: 'Credit/Debit Card',
      cod: 'Cash on Delivery',
    };

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/50">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
              <CardDescription className="text-base">
                This is a demo checkout. No actual payment has been processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Name:</span>
                  <span className="font-medium">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{email}</span>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Delivery Address:</h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>{addressLine1}</p>
                    {addressLine2 && <p>{addressLine2}</p>}
                    <p>{city}, {stateProvince} {postalCode}</p>
                    <p>{country}</p>
                    {phoneNumber && <p className="mt-2">Phone: {phoneNumber}</p>}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">{paymentMethodLabels[paymentMethod]}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-primary">{formatINR(BigInt(total))}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate({ to: '/' })}
              >
                Continue Shopping
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setOrderPlaced(false);
                  setFullName('');
                  setEmail('');
                  setQuantity(1);
                  setPaymentMethod('upi');
                  setAddressLine1('');
                  setAddressLine2('');
                  setCity('');
                  setStateProvince('');
                  setPostalCode('');
                  setCountry('');
                  setPhoneNumber('');
                  navigate({ to: '/' });
                }}
              >
                Place Another Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Checkout form
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8">
          Checkout
        </h1>

        {showValidationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fill in all required fields before placing your order.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isCartMode ? (
                    // Cart mode: show all items
                    <>
                      {cartItems.map((item) => {
                        const mappedImage = getProductImagePath({ brand: item.product.brand, name: item.product.name });
                        const itemImage = item.product.imgPath || mappedImage || fallbackImage;
                        const itemSubtotal = Number(item.product.discountedPrice) * item.quantity;

                        return (
                          <div key={item.product.id.toString()} className="flex gap-4">
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-border bg-muted/50">
                              <img
                                src={itemImage}
                                alt={item.product.name}
                                onError={(e) => {
                                  e.currentTarget.src = fallbackImage;
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h3 className="font-semibold text-sm">{item.product.name}</h3>
                              <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                                <span className="font-semibold text-primary">{formatINR(BigInt(itemSubtotal))}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <Separator />
                    </>
                  ) : (
                    // Single product mode
                    product && (
                      <>
                        <div className="flex gap-4">
                          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-border bg-muted/50">
                            <img
                              src={product.imgPath || getProductImagePath({ brand: product.brand, name: product.name }) || fallbackImage}
                              alt={product.name}
                              onError={(e) => {
                                e.currentTarget.src = fallbackImage;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                            <p className="text-lg font-bold text-primary">
                              {formatINR(product.discountedPrice)}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        {/* Quantity Selector */}
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              disabled={quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-20 text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setQuantity(quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Separator />
                      </>
                    )
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatINR(BigInt(total))}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatINR(BigInt(total))}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Information, Delivery Address & Payment */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      type="text"
                      placeholder="Street address, P.O. box"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      type="text"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stateProvince">State/Province *</Label>
                      <Input
                        id="stateProvince"
                        type="text"
                        placeholder="State/Province"
                        value={stateProvince}
                        onChange={(e) => setStateProvince(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        type="text"
                        placeholder="Postal code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Phone number (optional)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1 cursor-pointer">
                        UPI
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!isFormValid}
              >
                Place Order
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

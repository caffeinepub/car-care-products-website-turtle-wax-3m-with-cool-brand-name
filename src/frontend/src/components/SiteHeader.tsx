import { useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Menu, X, ShoppingCart, Heart, Package, Grid3x3, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { BRANDING } from '@/config/branding';
import { ChangeRequestPanel } from './ChangeRequestPanel';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const isHomePage = routerState.location.pathname === '/';
  
  const { getItemCount } = useCart();
  const { getCount } = useWishlist();
  
  const cartCount = getItemCount();
  const wishlistCount = getCount();

  const handleNavigation = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    } else {
      navigate({ to: '/' }).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      });
      setMobileMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    navigate({ to: '/' });
  };

  const handleAllProductsClick = () => {
    navigate({ to: '/all-products' });
    setMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    navigate({ to: '/cart' });
    setMobileMenuOpen(false);
  };

  const handleWishlistClick = () => {
    navigate({ to: '/wishlist' });
    setMobileMenuOpen(false);
  };

  const handleMyProductsClick = () => {
    navigate({ to: '/my-products' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/assets/generated/site-logo-user.dim_512x512.png" 
              alt={BRANDING.appName}
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {BRANDING.appName}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                {BRANDING.tagline}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavigation('home')}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={handleAllProductsClick}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              All Products
            </button>
            <button
              onClick={() => handleNavigation('brands')}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Brands
            </button>
            <button
              onClick={() => handleNavigation('about')}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              About
            </button>
            <button
              onClick={handleMyProductsClick}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              My Products
            </button>
            
            {/* Change Request Button */}
            <ChangeRequestPanel 
              trigger={
                <Button variant="ghost" size="sm">
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  Change Request
                </Button>
              }
            />
            
            {/* Cart and Wishlist Icons */}
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={handleWishlistClick}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-border/40">
            <button
              onClick={() => handleNavigation('home')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
            >
              Home
            </button>
            <button
              onClick={handleAllProductsClick}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
            >
              <span className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4" />
                All Products
              </span>
            </button>
            <button
              onClick={() => handleNavigation('brands')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
            >
              Brands
            </button>
            <button
              onClick={() => handleNavigation('about')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
            >
              About
            </button>
            <button
              onClick={handleMyProductsClick}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                My Products
              </span>
            </button>
            <div className="px-4 py-2">
              <ChangeRequestPanel 
                trigger={
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquarePlus className="h-4 w-4 mr-2" />
                    Change Request
                  </Button>
                }
              />
            </div>
            <div className="border-t border-border/40 pt-2 mt-2">
              <button
                onClick={handleWishlistClick}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </span>
                {wishlistCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={handleCartClick}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                </span>
                {cartCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {cartCount}
                  </Badge>
                )}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

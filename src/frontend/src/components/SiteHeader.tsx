import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRANDING } from '@/config/branding';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <button 
            onClick={() => scrollToSection('home')}
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
              onClick={() => scrollToSection('home')}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('brands')}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Brands
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              About
            </button>
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
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('brands')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
            >
              Brands
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/50 rounded transition-colors"
            >
              About
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

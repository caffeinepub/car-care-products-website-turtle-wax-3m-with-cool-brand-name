import { useEffect } from 'react';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { HomeHero } from './components/HomeHero';
import { BrandSection } from './components/BrandSection';
import { BrandsSection } from './components/BrandsSection';
import { AboutSection } from './components/AboutSection';
import { EmptyState } from './components/EmptyState';
import { useProducts } from './hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { BRANDING } from './config/branding';

function App() {
  const { data: products, isLoading, isError } = useProducts();

  // Set document title
  useEffect(() => {
    document.title = `${BRANDING.appName} - ${BRANDING.tagline}`;
  }, []);

  // Group products by brand
  const turtleWaxProducts = products?.filter(p => p.brand === 'Turtle Wax') || [];
  const threeMProducts = products?.filter(p => p.brand === '3M') || [];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Home Section */}
        <section id="home">
          <HomeHero />
          
          <div className="container mx-auto px-4 py-16 space-y-20">
            {isLoading ? (
              <div className="space-y-20">
                <div className="space-y-8">
                  <Skeleton className="h-12 w-64" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : isError ? (
              <EmptyState 
                title="Unable to Load Products"
                description="We're having trouble loading our product catalog. Please try again later."
              />
            ) : products && products.length === 0 ? (
              <EmptyState 
                title="No Products Available"
                description="Our product catalog is being updated. Check back soon for premium car care products."
              />
            ) : (
              <>
                {turtleWaxProducts.length > 0 && (
                  <BrandSection 
                    brand="Turtle Wax"
                    products={turtleWaxProducts}
                  />
                )}
                
                {threeMProducts.length > 0 && (
                  <BrandSection 
                    brand="3M"
                    products={threeMProducts}
                  />
                )}
              </>
            )}
          </div>
        </section>

        {/* Brands Section */}
        <section id="brands" className="bg-primary/5">
          <BrandsSection />
        </section>

        {/* About Section */}
        <section id="about">
          <AboutSection />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;

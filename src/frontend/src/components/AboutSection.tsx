import { Package, Award, Users } from 'lucide-react';
import { BRANDING } from '@/config/branding';

export function AboutSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            About {BRANDING.appName}
          </h2>
          <p className="text-lg text-muted-foreground">
            Your trusted source for premium car care products
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed text-center mb-12">
            {BRANDING.appName} is your premier destination for professional-grade car care products. 
            We showcase a carefully curated selection of industry-leading brands including Turtle Wax 
            and 3M, bringing you the same products trusted by professional detailers and automotive 
            enthusiasts around the world.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 not-prose">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 bg-primary/10 rounded-lg">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Premium Selection</h3>
              <p className="text-sm text-muted-foreground">
                Only the finest products from trusted manufacturers
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex p-4 bg-primary/10 rounded-lg">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Professional Grade</h3>
              <p className="text-sm text-muted-foreground">
                Products used by detailing professionals worldwide
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex p-4 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Expert Curation</h3>
              <p className="text-sm text-muted-foreground">
                Carefully selected for quality and performance
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            This is a product showcase platform. We display premium car care products to help you 
            discover the best solutions for your vehicle's maintenance and detailing needs.
          </p>
        </div>
      </div>
    </div>
  );
}

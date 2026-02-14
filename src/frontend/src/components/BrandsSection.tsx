import { Sparkles, Shield } from 'lucide-react';

export function BrandsSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Our Featured Brands
          </h2>
          <p className="text-lg text-muted-foreground">
            We partner with the most trusted names in automotive care
          </p>
        </div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Turtle Wax */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-lg hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Turtle Wax</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Since 1944, Turtle Wax has been a pioneer in car care innovation. Their comprehensive range 
              of waxes, polishes, and detailing products delivers professional results for enthusiasts and 
              professionals alike. From their iconic paste wax to cutting-edge ceramic coatings, Turtle Wax 
              continues to set the standard for automotive appearance care.
            </p>
          </div>

          {/* 3M */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-lg hover:border-destructive/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">3M</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              3M brings decades of scientific innovation to automotive care. Known for their professional-grade 
              compounds, polishes, and abrasives, 3M products are trusted by body shops and detailers worldwide. 
              Their advanced formulations deliver superior paint correction, protection, and finishing results 
              that stand the test of time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

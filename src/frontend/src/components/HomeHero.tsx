export function HomeHero() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Premium Car Care
              <span className="block text-primary mt-2">Products & Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Discover professional-grade detailing products from industry-leading brands like Turtle Wax and 3M. 
              Everything you need to keep your vehicle looking showroom fresh.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl border border-border/50">
              <img
                src="/assets/generated/hero-banner.dim_1600x600.png"
                alt="Professional car detailing"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-destructive/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

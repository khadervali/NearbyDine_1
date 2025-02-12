import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Utensils, MapPin, Heart, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070")',
            // Alternative high-quality restaurant images:
            // 'url("https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=2070")' // Elegant dining
            // 'url("https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?q=80&w=2070")' // Modern interior
            // 'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2070")' // Cozy restaurant
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r 
            from-background/80 via-background/60 to-background/40 
            dark:from-background/90 dark:via-background/75 dark:to-background/60 
            backdrop-blur-[2px]" 
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-purple-500/20 border border-purple-400/30 mb-8">
              <Star className="h-4 w-4 text-purple-400 fill-purple-400" />
              <span className="text-sm font-medium text-purple-300">Powered by Google Places API</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-white">Find Your Next</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r 
                from-purple-400 to-purple-600 drop-shadow-sm">
                Favorite Restaurant
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
              Discover the best local restaurants, read authentic reviews, and explore diverse cuisines. 
              Your next memorable dining experience is just a click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="text-lg bg-gradient-to-r from-purple-500 to-purple-600 
                  hover:from-purple-600 hover:to-purple-700 
                  border-0 text-white shadow-lg"
              >
                <Link href="/restaurants">
                  Explore Restaurants
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="secondary"
                className="text-lg bg-white/10 backdrop-blur-md
                  hover:bg-white/15
                  text-purple-100
                  border border-purple-200/20 shadow-lg
                  hover:border-purple-200/30"
              >
                <Link href="/popular-places">
                  View Popular Places
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-foreground">
              Why Choose NearbyDine?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine the power of Google Places with a seamless user experience to help you 
              discover the perfect dining spot.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative p-8 rounded-2xl glass-effect
                  shadow-[0_8px_32px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.1)]
                  bg-white/10 backdrop-blur-[12px]
                  border border-white/20
                  transition-all duration-300 ease-out
                  overflow-hidden
                  hover:bg-white/[0.15]"
              >
                {/* Bluish shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                  bg-gradient-to-r from-purple-500/10 via-purple-400/5 to-transparent
                  blur-2xl transition-opacity duration-500 ease-out" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 rounded-2xl" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 
                    rounded-xl glass-container bg-white/10
                    shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                    <feature.icon className="h-7 w-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Real-Time Updates",
    description: "Get the latest information about restaurants, including hours, ratings, and reviews directly from Google Places.",
    icon: Utensils,
  },
  {
    title: "Location-Based Search",
    description: "Find the perfect restaurant near you with accurate distance information and easy-to-follow directions.",
    icon: MapPin,
  },
  {
    title: "Personalized Experience",
    description: "Save your favorite restaurants and get personalized recommendations based on your preferences.",
    icon: Heart,
  },
];

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Utensils, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 inline-block p-4 bg-primary/10 rounded-full">
            <Utensils className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Discover Great Places to Eat Nearby
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find the best restaurants around you, read reviews, and save your favorites.
            All powered by Google Places to ensure you get the most accurate and up-to-date information.
          </p>

          <Button asChild size="lg" className="inline-flex items-center gap-2">
            <Link href="/restaurants">
              Find Restaurants <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose NearbyDine?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border bg-white shadow-sm"
              >
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
    title: "Real-Time Data",
    description: "Get up-to-date information about restaurants directly from Google Places.",
    icon: Utensils,
  },
  {
    title: "Location-Based",
    description: "Find restaurants near you with accurate distance and directions.",
    icon: Utensils,
  },
  {
    title: "Save Favorites",
    description: "Keep track of restaurants you love by saving them to your favorites.",
    icon: Utensils,
  },
];

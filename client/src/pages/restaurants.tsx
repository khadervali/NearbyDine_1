import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { RestaurantList } from "@/components/restaurant-list";
import { SearchFilters } from "@/components/search-filters";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Restaurant {
  place_id: string;
  name: string;
  rating: string;
  photos?: { getUrl: () => string }[];
  vicinity: string;
}

interface RestaurantsProps {
  userId?: number;
}

export default function Restaurants({ userId }: RestaurantsProps) {
  const { latitude, longitude, error, loading } = useGeolocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      if (!latitude || !longitude) return;

      try {
        const response = await fetch(
          `/api/restaurants?latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        setRestaurants(data.results || []);
        setFilteredRestaurants(data.results || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch restaurants. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchRestaurants();
  }, [latitude, longitude, toast]);

  const handleSearch = (query: string) => {
    const filtered = restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  const handleRatingFilter = (rating: string) => {
    const filtered = restaurants.filter(
      (restaurant) => Number(restaurant.rating) >= parseFloat(rating)
    );
    setFilteredRestaurants(filtered);
  };

  const handleDistanceFilter = (distance: string) => {
    // In a real app, you would calculate actual distances
    // For now, we'll just filter based on a random subset
    const filtered = restaurants.slice(0, parseInt(distance) / 100);
    setFilteredRestaurants(filtered);
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nearby Restaurants</h1>

      <SearchFilters
        onSearch={handleSearch}
        onRatingFilter={handleRatingFilter}
        onDistanceFilter={handleDistanceFilter}
      />

      <RestaurantList restaurants={filteredRestaurants} userId={userId} />
    </div>
  );
}
import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { RestaurantList } from "@/components/restaurant-list";
import { SearchFilters } from "@/components/search-filters";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RestaurantsProps {
  userId?: number;
}

export default function Restaurants({ userId }: RestaurantsProps) {
  const { latitude, longitude, error, loading } = useGeolocation();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      if (!latitude || !longitude) return;

      try {
        // In a real app, this would be an API call to your backend
        // which would then call the Google Places API
        const placesResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=restaurant&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        const data = await placesResponse.json();
        setRestaurants(data.results);
        setFilteredRestaurants(data.results);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch restaurants",
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
      (restaurant) => restaurant.rating >= parseFloat(rating)
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

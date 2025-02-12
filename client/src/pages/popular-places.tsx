import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopularPlace {
  place_id: string;
  name: string;
  rating: string;
  photos: { url: string }[];
  vicinity: string;
  user_ratings_total: number;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070";

export default function PopularPlaces() {
  const { latitude, longitude, error, loading } = useGeolocation();
  const [places, setPlaces] = useState<PopularPlace[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const fetchPopularPlaces = async (pageToken?: string) => {
    if (!latitude || !longitude) return;

    try {
      const url = new URL('/api/popular-places', window.location.origin);
      url.searchParams.append('latitude', latitude.toString());
      url.searchParams.append('longitude', longitude.toString());
      if (pageToken) {
        url.searchParams.append('pageToken', pageToken);
      }

      console.log('Requesting popular places from:', url.toString());

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.error) {
        throw new Error(data.details || data.error);
      }

      if (pageToken) {
        setPlaces(prev => [...prev, ...(data.results || [])]);
      } else {
        setPlaces(data.results || []);
      }

      setNextPageToken(data.next_page_token || null);

    } catch (error) {
      console.error('Popular places error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch popular places. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPopularPlaces();
  }, [latitude, longitude]);

  const handleLoadMore = async () => {
    if (!nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await fetchPopularPlaces(nextPageToken);
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Popular Places Near You
        </h1>

        {/* Search bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search popular places..."
            className="w-full h-12 pl-12 pr-4 rounded-lg
              bg-card/50 border border-border/10
              text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* Places grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place.place_id}
              className="group rounded-3xl overflow-hidden glass-card"
            >
              <div className="relative h-48">
                {place.photos?.[0]?.url ? (
                  <img
                    src={place.photos[0].url}
                    alt={place.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-card/70">
                    <img
                      src={FALLBACK_IMAGE}
                      alt="Place placeholder"
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                )}
                <button className="absolute top-4 right-4 p-2 rounded-full
                  bg-black/20 backdrop-blur-sm border border-white/10
                  hover:bg-black/30 transition-colors">
                  <Heart className="h-5 w-5 text-white" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full
                    bg-primary/10 border border-primary/20">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="text-sm font-medium text-primary">
                      {place.rating} ({place.user_ratings_total})
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {place.vicinity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {nextPageToken && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              variant="outline"
              className="bg-card/50 border-white/10 text-white
                hover:bg-card/70 hover:border-white/20"
              size="lg"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Places'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 
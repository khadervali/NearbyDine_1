import { RestaurantCard } from "./restaurant-card";
import { useQuery } from "@tanstack/react-query";
import type { Favorite } from "@shared/schema";

interface Restaurant {
  place_id: string;
  name: string;
  rating: string;
  photos: { url: string }[];
  vicinity: string;
}

interface RestaurantListProps {
  restaurants: Restaurant[];
  userId?: number;
}

export function RestaurantList({ restaurants, userId }: RestaurantListProps) {
  const { data: favorites } = useQuery<Favorite[]>({
    queryKey: userId ? [`/api/users/${userId}/favorites`] : [],
    enabled: !!userId,
  });

  const favoriteIds = favorites?.map(f => f.placeId) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.place_id}
          placeId={restaurant.place_id}
          name={restaurant.name}
          rating={restaurant.rating}
          photo={restaurant.photos?.[0]?.url}
          address={restaurant.vicinity}
          isFavorite={favoriteIds.includes(restaurant.place_id)}
          userId={userId}
        />
      ))}
    </div>
  );
}
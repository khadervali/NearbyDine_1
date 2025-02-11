import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface RestaurantCardProps {
  placeId: string;
  name: string;
  rating: string;
  photo: string;
  address: string;
  isFavorite?: boolean;
  userId?: number;
}

export function RestaurantCard({
  placeId,
  name,
  rating,
  photo,
  address,
  isFavorite,
  userId
}: RestaurantCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function toggleFavorite() {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await fetch(`/api/users/${userId}/favorites/${placeId}`, {
          method: "DELETE",
        });
      } else {
        await fetch(`/api/users/${userId}/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placeId, name, rating, photo, address }),
        });
      }
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/favorites`] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={photo || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={name}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span>{rating}</span>
        </div>
        <p className="text-sm text-gray-600">{address}</p>
      </CardContent>
    </Card>
  );
}

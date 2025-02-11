import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Phone, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import type { Review } from "@shared/schema";
import { format } from "date-fns";
import { ReviewDialog } from "@/components/review-dialog";

interface Restaurant {
  place_id: string;
  name: string;
  rating: string;
  photos: { url: string }[];
  vicinity: string;
  formatted_phone_number?: string;
  opening_hours?: {
    weekday_text: string[];
  };
}

export default function RestaurantDetails() {
  const { placeId } = useParams();
  const [user] = useAuthState(auth);
  const userId = user ? 1 : undefined; // In a real app, this would come from your backend

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery<Restaurant>({
    queryKey: [`/api/restaurants/${placeId}`],
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/restaurants/${placeId}/reviews`],
  });

  const { data: userReview } = useQuery<Review>({
    queryKey: userId ? [`/api/users/${userId}/reviews/${placeId}`] : [],
    enabled: !!userId,
  });

  if (isLoadingRestaurant || isLoadingReviews) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/restaurants">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Restaurants
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-video rounded-lg overflow-hidden mb-6">
            <img
              src={restaurant.photos?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <Card>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-lg">{restaurant.rating} rating</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 mt-1" />
                  <span>{restaurant.vicinity}</span>
                </div>

                {restaurant.formatted_phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    <span>{restaurant.formatted_phone_number}</span>
                  </div>
                )}

                {restaurant.opening_hours?.weekday_text && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 mt-1" />
                    <div className="space-y-1">
                      {restaurant.opening_hours.weekday_text.map((hours) => (
                        <div key={hours} className="text-sm">
                          {hours}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {userId && (
              <ReviewDialog
                placeId={placeId}
                userId={userId}
                existingReview={userReview}
              />
            )}
          </div>

          {reviews?.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews?.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <span className="font-medium">User</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(review.createdAt), "PPp")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

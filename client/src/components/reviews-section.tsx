import { useQuery } from "@tanstack/react-query";
import { Star, User } from "lucide-react";
import { ReviewDialog } from "./review-dialog";
import type { Review } from "@shared/schema";
import { format } from "date-fns";

interface ReviewsSectionProps {
  placeId: string;
  userId?: number;
}

export function ReviewsSection({ placeId, userId }: ReviewsSectionProps) {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: [`/api/restaurants/${placeId}/reviews`],
  });

  const { data: userReview } = useQuery<Review>({
    queryKey: userId ? [`/api/users/${userId}/reviews/${placeId}`] : [],
    enabled: !!userId,
  });

  if (isLoading) {
    return <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews</h3>
        {userId && (
          <ReviewDialog
            placeId={placeId}
            userId={userId}
            existingReview={userReview}
          />
        )}
      </div>

      <div className="space-y-4">
        {reviews?.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews?.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium">User</span>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

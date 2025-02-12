import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Phone, Clock, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect } from 'react';
import { PhotoModal } from "@/components/photo-modal";

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
  reviews?: {
    author_name: string;
    rating: number;
    relative_time_description: string;
    text: string;
    profile_photo_url: string;
  }[];
}

export default function RestaurantDetails() {
  const { placeId } = useParams();
  const [user] = useAuthState(auth);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery<Restaurant>({
    queryKey: [`/api/restaurants/${placeId}`],
  });

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setModalOpen(true);
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      Math.min((restaurant?.photos?.length || 1) - 1, prev + 1)
    );
  };

  if (isLoadingRestaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;

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
          <div className="relative mb-6">
            <div className="overflow-hidden rounded-lg" ref={emblaRef}>
              <div className="flex">
                {restaurant.photos?.map((photo, index) => (
                  <div 
                    key={index} 
                    className="relative flex-[0_0_100%] min-w-0 cursor-pointer"
                    onClick={() => handlePhotoClick(index)}
                  >
                    <div className="aspect-video">
                      <img
                        src={photo.url}
                        alt={`${restaurant.name} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white ${
                !prevBtnEnabled && 'opacity-50 cursor-not-allowed'
              }`}
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white ${
                !nextBtnEnabled && 'opacity-50 cursor-not-allowed'
              }`}
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {restaurant.photos ? `1/${restaurant.photos.length}` : '0/0'}
            </div>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <Button asChild variant="outline">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  Write a Review on Google Maps
                </a>
              </Button>
            </div>

            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              <div className="space-y-4">
                {restaurant.reviews.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-medium">{review.author_name}</span>
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
                      <p className="text-gray-600">{review.text}</p>
                      <p className="text-sm text-gray-400">
                        {review.relative_time_description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
      </div>

      {restaurant.photos && (
        <PhotoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          photos={restaurant.photos}
          currentIndex={currentPhotoIndex}
          onPrevious={handlePreviousPhoto}
          onNext={handleNextPhoto}
        />
      )}
    </div>
  );
}

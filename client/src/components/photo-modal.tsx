import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: { url: string }[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function PhotoModal({
  isOpen,
  onClose,
  photos,
  currentIndex,
  onPrevious,
  onNext,
}: PhotoModalProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Get image dimensions before rendering
  useEffect(() => {
    if (photos[currentIndex]) {
      const img = new Image();
      img.src = photos[currentIndex].url;
      img.onload = () => {
        const maxWidth = window.innerWidth * 0.8;  // 80% of viewport width
        const maxHeight = window.innerHeight * 0.8; // 80% of viewport height
        
        let width = img.width;
        let height = img.height;
        
        // Scale down if image is larger than max dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        setDimensions({ width, height });
      };
    }
  }, [photos, currentIndex]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent 
        className="p-0 gap-0 border-none bg-transparent shadow-none"
        style={{ 
          maxWidth: `${dimensions.width + 100}px`,  // Add padding for navigation
          maxHeight: `${dimensions.height + 150}px` // Add space for header and thumbnails
        }}
      >
        <div className="relative flex flex-col w-full h-full bg-black/95 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-2 bg-gradient-to-b from-black/60 to-transparent">
            <span className="text-white/90 text-sm">
              Photo {currentIndex + 1} of {photos.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Main content */}
          <div className="flex-1 flex items-center justify-center p-2">
            <div className="relative flex items-center justify-center">
              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute -left-4 z-50 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all h-8 w-8",
                  currentIndex === 0 && "opacity-50 cursor-not-allowed"
                )}
                onClick={onPrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Image */}
              <img
                src={photos[currentIndex].url}
                alt={`Photo ${currentIndex + 1}`}
                className="rounded-md shadow-lg object-contain"
                style={{
                  width: dimensions.width,
                  height: dimensions.height
                }}
              />

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute -right-4 z-50 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all h-8 w-8",
                  currentIndex === photos.length - 1 && "opacity-50 cursor-not-allowed"
                )}
                onClick={onNext}
                disabled={currentIndex === photos.length - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="relative p-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index !== currentIndex) {
                      index < currentIndex ? onPrevious() : onNext();
                    }
                  }}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all",
                    currentIndex === index ? "ring-2 ring-white ring-offset-1 ring-offset-black" : "opacity-50 hover:opacity-75"
                  )}
                >
                  <img
                    src={photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
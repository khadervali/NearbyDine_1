import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFavoriteSchema, insertReviewSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByGoogleId(userData.googleId);

      if (existingUser) {
        res.json(existingUser);
      } else {
        const newUser = await storage.createUser(userData);
        res.json(newUser);
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Restaurants route
  app.get("/api/restaurants", async (req, res) => {
    try {
      const { latitude, longitude, radius = 5000 } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch from Google Places API');
      }

      const data = await response.json();

      // Transform the results to include direct photo URLs
      const transformedResults = data.results.map((place: any) => ({
        ...place,
        photos: place.photos?.map((photo: any) => ({
          url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${apiKey}`
        })) || []
      }));

      res.json({
        ...data,
        results: transformedResults
      });
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  // Add this route before the reviews routes
  app.get("/api/restaurants/:placeId", async (req, res) => {
    try {
      const placeId = req.params.placeId;
      const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,opening_hours,photos,vicinity&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch from Google Places API');
      }

      const data = await response.json();

      // Transform the photos to include direct URLs
      const transformedResult = {
        ...data.result,
        photos: data.result.photos?.map((photo: any) => ({
          url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`
        })) || []
      };

      res.json(transformedResult);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      res.status(500).json({ error: "Failed to fetch restaurant details" });
    }
  });


  // Favorites routes
  app.get("/api/users/:userId/favorites", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const favorites = await storage.getFavorites(userId);
    res.json(favorites);
  });

  app.post("/api/users/:userId/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favoriteData = insertFavoriteSchema.parse({ ...req.body, userId });
      const favorite = await storage.addFavorite(favoriteData);
      res.json(favorite);
    } catch (error) {
      res.status(400).json({ error: "Invalid favorite data" });
    }
  });

  app.delete("/api/users/:userId/favorites/:placeId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const placeId = req.params.placeId;
    await storage.removeFavorite(userId, placeId);
    res.status(204).send();
  });

  // Reviews routes
  app.get("/api/restaurants/:placeId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews(req.params.placeId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.get("/api/users/:userId/reviews/:placeId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const review = await storage.getUserReview(userId, req.params.placeId);
      if (review) {
        res.json(review);
      } else {
        res.status(404).json({ error: "Review not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch review" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.addReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ error: "Invalid review data" });
    }
  });

  app.patch("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reviewData = insertReviewSchema.partial().parse(req.body);
      const review = await storage.updateReview(id, reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ error: "Invalid review data" });
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteReview(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
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
      const { latitude, longitude, pageToken } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=restaurant&rankby=distance&key=${apiKey}`;

      if (pageToken) {
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${pageToken}&key=${apiKey}`;
      }

      const response = await fetch(url);

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
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,formatted_phone_number,opening_hours,photos,vicinity&key=${apiKey}&reviews_sort=newest&reviews_no_translations=false`
      );
      console.log("response:", response);

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
      console.log("Sending reviews:", reviews);
      res.json(reviews);
    } catch (error) {
      console.error("Error in reviews route:", error);
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

  // Popular places endpoint with better error handling and photo URL transformation
  app.get('/api/popular-places', async (req, res) => {
    const { latitude, longitude, pageToken } = req.query;

    try {
      if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      
      // More detailed API key logging
      if (!apiKey) {
        console.error('GOOGLE_MAPS_API_KEY is not set in environment variables');
        return res.status(500).json({ 
          error: 'Server configuration error',
          details: 'API key is not configured'
        });
      }

      // Log request parameters
      console.log('Request parameters:', {
        latitude,
        longitude,
        pageToken: pageToken || 'none'
      });

      const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
      url.searchParams.append('location', `${latitude},${longitude}`);
      url.searchParams.append('radius', '5000');
      url.searchParams.append('type', 'point_of_interest');
      url.searchParams.append('key', apiKey);

      if (pageToken) {
        url.searchParams.append('pagetoken', pageToken as string);
      }

      console.log('Requesting URL:', url.toString().replace(apiKey, 'API_KEY_HIDDEN'));

      try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        
        console.log('Response headers:', {
          status: response.status,
          contentType,
          headers: Object.fromEntries(response.headers.entries())
        });

        const text = await response.text();
        console.log('Raw response text:', text.substring(0, 500));

        // Try to parse the response
        const data = JSON.parse(text);

        // Check Google Places API response status
        if (data.status !== 'OK') {
          console.error('Google Places API error:', data);
          return res.status(400).json({
            error: 'Google Places API error',
            details: data.error_message || data.status
          });
        }

        // Transform the results
        const transformedResults = data.results.map((place: any) => ({
          ...place,
          photos: place.photos?.map((photo: any) => ({
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${apiKey}`
          })) || []
        }));

        return res.json({
          status: data.status,
          next_page_token: data.next_page_token,
          results: transformedResults
        });

      } catch (fetchError) {
        console.error('Fetch or parsing error:', fetchError);
        return res.status(500).json({
          error: 'Failed to fetch places',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        });
      }

    } catch (error) {
      console.error('Top level error:', error);
      return res.status(500).json({
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
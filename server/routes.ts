import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFavoriteSchema } from "@shared/schema";

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
      res.json(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).json({ error: "Failed to fetch restaurants" });
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

  const httpServer = createServer(app);
  return httpServer;
}
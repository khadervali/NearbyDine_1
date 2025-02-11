import { users, favorites, reviews, type User, type InsertUser, type Favorite, type InsertFavorite, type Review, type InsertReview } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getFavorites(userId: number): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, placeId: string): Promise<void>;
  getReviews(placeId: string): Promise<Review[]>;
  getUserReview(userId: number, placeId: string): Promise<Review | undefined>;
  addReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review>;
  deleteReview(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getFavorites(userId: number): Promise<Favorite[]> {
    return db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db.insert(favorites).values(insertFavorite).returning();
    return favorite;
  }

  async removeFavorite(userId: number, placeId: string): Promise<void> {
    await db
      .delete(favorites)
      .where(
        eq(favorites.userId, userId) && 
        eq(favorites.placeId, placeId)
      );
  }

  async getReviews(placeId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.placeId, placeId));
  }

  async getUserReview(userId: number, placeId: string): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.userId, userId),
          eq(reviews.placeId, placeId)
        )
      );
    return review;
  }

  async addReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async updateReview(id: number, reviewUpdate: Partial<InsertReview>): Promise<Review> {
    const [review] = await db
      .update(reviews)
      .set(reviewUpdate)
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }
}

export const storage = new DatabaseStorage();
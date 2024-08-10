import express, { Request, Response, NextFunction } from "express";
import { GetFoodAvailability, GetAvailableOffers, GetFoodsIn30Min, GetTopRestaurants, RestaurantById, SearchFoods } from "../controllers";

const router = express.Router();

// Get available Food Availability
router.get("/:postcode", GetFoodAvailability);

// Top Restaurant
router.get("/top-restaurant/:postcode", GetTopRestaurants);

// - Food Available in 30 Minutes
router.get("/foods-in-30-min/:postcode", GetFoodsIn30Min);

// Search Foods
router.get("/search/:postcode", SearchFoods);

// Find Restaurant by ID
router.get("/restaurant/:id", RestaurantById);

// Search Offers
router.get("/offers/:postcode", GetAvailableOffers);

export { router as ShoppingRoute };

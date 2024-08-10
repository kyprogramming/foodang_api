import { Request, Response, NextFunction } from "express";
import {
    GetAvailableOffersService,
    GetFoodAvailabilityService,
    GetFoodsIn30MinService,
    GetTopRestaurantsService,
    RestaurantByIdService,
    SearchFoodsService,
} from "../services";

export const GetFoodAvailability = (req: Request, res: Response, next: NextFunction) => GetFoodAvailabilityService(req, res, next);

export const GetTopRestaurants = (req: Request, res: Response, next: NextFunction) => GetTopRestaurantsService(req, res, next);

export const GetFoodsIn30Min = (req: Request, res: Response, next: NextFunction) => GetFoodsIn30MinService(req, res, next);

export const SearchFoods = (req: Request, res: Response, next: NextFunction) => SearchFoodsService(req, res, next);

export const RestaurantById = (req: Request, res: Response, next: NextFunction) => RestaurantByIdService(req, res, next);

export const GetAvailableOffers = (req: Request, res: Response, next: NextFunction) => GetAvailableOffersService(req, res, next);

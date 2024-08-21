import { Request, Response, NextFunction } from "express";
import { AddOfferService, DeleteOfferService, EditOfferService, GetOffersService } from "../services";
import {
    AddFoodService,
    GetCurrentOrdersService,
    GetFoodsService,
    GetOrderDetailsService,
    GetRestaurantProfileService,
    ProcessOrderService,
    UpdateRestaurantCoverImageService,
    UpdateRestaurantProfileService,
    UpdateRestaurantStatusService,
} from "../services";

export const RestaurantLogin = (req: Request, res: Response, next: NextFunction) => RestaurantLogin(req, res, next);

export const GetRestaurantProfile = (req: Request, res: Response, next: NextFunction) => GetRestaurantProfileService(req, res, next);

export const UpdateRestaurantProfile = (req: Request, res: Response, next: NextFunction) => UpdateRestaurantProfileService(req, res, next);

export const UpdateRestaurantCoverImage = (req: Request, res: Response, next: NextFunction) => UpdateRestaurantCoverImageService(req, res, next);

export const UpdateRestaurantStatus = (req: Request, res: Response, next: NextFunction) => UpdateRestaurantStatusService(req, res, next);

export const AddFood = (req: Request, res: Response, next: NextFunction) => AddFoodService(req, res, next);

export const GetFoods = (req: Request, res: Response, next: NextFunction) => GetFoodsService(req, res, next);

export const GetCurrentOrders = (req: Request, res: Response, next: NextFunction) => GetCurrentOrdersService(req, res, next);

export const GetOrderDetails = (req: Request, res: Response, next: NextFunction) => GetOrderDetailsService(req, res, next);

export const ProcessOrder = (req: Request, res: Response, next: NextFunction) => ProcessOrderService(req, res, next);

export const AddOffer = (req: Request, res: Response, next: NextFunction) => AddOfferService(req, res, next);

export const GetOffers = (req: Request, res: Response, next: NextFunction) => GetOffersService(req, res, next);

export const EditOffer = (req: Request, res: Response, next: NextFunction) => EditOfferService(req, res, next);

export const DeleteOffer = (req: Request, res: Response, next: NextFunction) => DeleteOfferService(req, res, next);

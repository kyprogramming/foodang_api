import { Request, Response, NextFunction } from "express";
import { AddOfferService, DeleteOfferService, EditOfferService, GetOffersService } from "../services";
import {
    AddFoodService,
    GetCurrentOrdersService,
    GetFoodsService,
    GetOrderDetailsService,
    GetVendorProfileService,
    ProcessOrderService,
    UpdateVendorCoverImageService,
    UpdateVendorProfileService,
    UpdateVendorStatusService,
} from "../services";

export const VendorLogin = (req: Request, res: Response, next: NextFunction) => VendorLogin(req, res, next);

export const GetVendorProfile = (req: Request, res: Response, next: NextFunction) => GetVendorProfileService(req, res, next);

export const UpdateVendorProfile = (req: Request, res: Response, next: NextFunction) => UpdateVendorProfileService(req, res, next);

export const UpdateVendorCoverImage = (req: Request, res: Response, next: NextFunction) => UpdateVendorCoverImageService(req, res, next);

export const UpdateVendorStatus = (req: Request, res: Response, next: NextFunction) => UpdateVendorStatusService(req, res, next);

export const AddFood = (req: Request, res: Response, next: NextFunction) => AddFoodService(req, res, next);

export const GetFoods = (req: Request, res: Response, next: NextFunction) => GetFoodsService(req, res, next);

export const GetCurrentOrders = (req: Request, res: Response, next: NextFunction) => GetCurrentOrdersService(req, res, next);

export const GetOrderDetails = (req: Request, res: Response, next: NextFunction) => GetOrderDetailsService(req, res, next);

export const ProcessOrder = (req: Request, res: Response, next: NextFunction) => ProcessOrderService(req, res, next);

export const AddOffer = (req: Request, res: Response, next: NextFunction) => AddOfferService(req, res, next);

export const GetOffers = (req: Request, res: Response, next: NextFunction) => GetOffersService(req, res, next);

export const EditOffer = (req: Request, res: Response, next: NextFunction) => EditOfferService(req, res, next);

export const DeleteOffer = (req: Request, res: Response, next: NextFunction) => DeleteOfferService(req, res, next);

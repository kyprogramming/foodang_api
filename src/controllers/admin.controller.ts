import { NextFunction, Request, Response } from "express";
import {
    SignupAdminService,
    AdminLoginService,
    CreateRestaurantService,
    GetRestaurantsService,
    GetRestaurantByIDService,
    GetTransactionsService,
    GetTransactionByIdService,
    VerifyDeliveryUserService,
    GetDeliveryUsersService,
    AdminLogoutService,
    ValidateTokenService,
} from "../services";

export const AdminSignup = (req: Request, res: Response, next: NextFunction) => SignupAdminService(req, res, next);

export const AdminLogin = (req: Request, res: Response, next: NextFunction) => AdminLoginService(req, res, next);

export const ValidateToken = (req: Request, res: Response, next: NextFunction) => ValidateTokenService(req, res, next);

export const AdminLogout = (req: Request, res: Response, next: NextFunction) => AdminLogoutService(req, res, next);

export const CreateRestaurant = (req: Request, res: Response, next: NextFunction) => CreateRestaurantService(req, res, next);

export const GetRestaurants = (req: Request, res: Response, next: NextFunction) => GetRestaurantsService(req, res, next);

export const GetRestaurantByID = (req: Request, res: Response, next: NextFunction) => GetRestaurantByIDService(req, res, next);

export const GetTransactions = (req: Request, res: Response, next: NextFunction) => GetTransactionsService(req, res, next);

export const GetTransactionById = (req: Request, res: Response, next: NextFunction) => GetTransactionByIdService(req, res, next);

export const VerifyDeliveryUser = (req: Request, res: Response, next: NextFunction) => VerifyDeliveryUserService(req, res, next);

export const GetDeliveryUsers = (req: Request, res: Response, next: NextFunction) => GetDeliveryUsersService(req, res, next);

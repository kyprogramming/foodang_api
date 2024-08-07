import { NextFunction, Request, Response } from "express";
import {
    SignupAdminService,
    AdminLoginService,
    CreateVendorService,
    GetVendorsService,
    GetVendorByIDService,
    GetTransactionsService,
    GetTransactionByIdService,
    VerifyDeliveryUserService,
    GetDeliveryUsersService,
} from "../services";

export const AdminSignup = (req: Request, res: Response, next: NextFunction) => SignupAdminService(req, res, next);

export const AdminLogin = (req: Request, res: Response, next: NextFunction) => AdminLoginService(req, res, next);

export const CreateVendor = (req: Request, res: Response, next: NextFunction) => CreateVendorService(req, res, next);

export const GetVendors = (req: Request, res: Response, next: NextFunction) => GetVendorsService(req, res, next);

export const GetVendorByID = (req: Request, res: Response, next: NextFunction) => GetVendorByIDService(req, res, next);

export const GetTransactions = (req: Request, res: Response, next: NextFunction) => GetTransactionsService(req, res, next);

export const GetTransactionById = (req: Request, res: Response, next: NextFunction) => GetTransactionByIdService(req, res, next);

export const VerifyDeliveryUser = (req: Request, res: Response, next: NextFunction) => VerifyDeliveryUserService(req, res, next);

export const GetDeliveryUsers = (req: Request, res: Response, next: NextFunction) => GetDeliveryUsersService(req, res, next);

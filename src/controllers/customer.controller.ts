import { Request, Response, NextFunction } from "express";
import {
    AddToCartService,
    CreateOrderService,
    CreatePaymentService,
    CustomerLoginService,
    CustomerSignUpService,
    CustomerOTPVerifyService,
    DeleteCartService,
    EditCustomerProfileService,
    GetCartService,
    GetCustomerProfileService,
    GetOrderByIdService,
    GetOrdersService,
    RequestOtpService,
    VerifyOfferService,
} from "../services";

export const CustomerSignUp = (req: Request, res: Response, next: NextFunction) => CustomerSignUpService(req, res, next);

export const CustomerLogin = (req: Request, res: Response, next: NextFunction) => CustomerLoginService(req, res, next);

export const CustomerOTPVerify = (req: Request, res: Response, next: NextFunction) => CustomerOTPVerifyService(req, res, next);

export const RequestOtp = (req: Request, res: Response, next: NextFunction) => RequestOtpService(req, res, next);

export const GetCustomerProfile = (req: Request, res: Response, next: NextFunction) => GetCustomerProfileService(req, res, next);

export const EditCustomerProfile = (req: Request, res: Response, next: NextFunction) => EditCustomerProfileService(req, res, next);

export const AddToCart = (req: Request, res: Response, next: NextFunction) => AddToCartService(req, res, next);

export const GetCart = (req: Request, res: Response, next: NextFunction) => GetCartService(req, res, next);

export const DeleteCart = (req: Request, res: Response, next: NextFunction) => DeleteCartService(req, res, next);

export const VerifyOffer = (req: Request, res: Response, next: NextFunction) => VerifyOfferService(req, res, next);

export const CreatePayment = (req: Request, res: Response, next: NextFunction) => CreatePaymentService(req, res, next);

export const CreateOrder = (req: Request, res: Response, next: NextFunction) => CreateOrderService(req, res, next);

export const GetOrders = (req: Request, res: Response, next: NextFunction) => GetOrdersService(req, res, next);

export const GetOrderById = (req: Request, res: Response, next: NextFunction) => GetOrderByIdService(req, res, next);

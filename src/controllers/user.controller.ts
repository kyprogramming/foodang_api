import { Request, Response, NextFunction } from "express";
import { AddUserService, CheckEmailExistService, UserRegisterService, UserLoginService, GoogleLoginService, VerifyEmailOTPService, UserLogoutService } from "../services";

export const AddUser = (req: Request, res: Response, next: NextFunction) => AddUserService(req, res, next);
export const CheckEmailExist = (req: Request, res: Response, next: NextFunction) => CheckEmailExistService(req, res, next);
export const UserRegister = (req: Request, res: Response, next: NextFunction) => UserRegisterService(req, res, next);
export const VerifyEmailOTP = (req: Request, res: Response, next: NextFunction) => VerifyEmailOTPService(req, res, next);
export const UserLogin = (req: Request, res: Response, next: NextFunction) => UserLoginService(req, res, next);
export const GoogleLogin = (req: Request, res: Response, next: NextFunction) => GoogleLoginService(req, res, next);

// Secured routes
export const UserLogout = (req: Request, res: Response, next: NextFunction) => UserLogoutService(req, res, next);

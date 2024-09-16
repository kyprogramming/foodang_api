import { Request, Response, NextFunction } from "express";
import {
    AddUserService,
    CheckEmailExistService,
    RegisterService,
    EmailLoginService,
    GoogleLoginService,
    VerifyEmailOTPService,
    UserLogoutService,
    SendOtpService,
    VerifyMobileOtpAndRegisterService,
    ForgotPasswordService,
    ResetPasswordService,
    GetUsersService,
} from "../services";

export const AddUser = (req: Request, res: Response, next: NextFunction) => AddUserService(req, res, next);
export const GetUsers = (req: Request, res: Response, next: NextFunction) => GetUsersService(req, res, next);
export const CheckEmailExist = (req: Request, res: Response, next: NextFunction) => CheckEmailExistService(req, res, next);
export const SendOtp = (req: Request, res: Response, next: NextFunction) => SendOtpService(req, res, next);
export const VerifyMobileOtpAndRegister = (req: Request, res: Response, next: NextFunction) => VerifyMobileOtpAndRegisterService(req, res, next);
export const Register = (req: Request, res: Response, next: NextFunction) => RegisterService(req, res, next);
export const VerifyEmailOTP = (req: Request, res: Response, next: NextFunction) => VerifyEmailOTPService(req, res, next);
export const Login = (req: Request, res: Response, next: NextFunction) => EmailLoginService(req, res, next);
export const ForgotPassword = (req: Request, res: Response, next: NextFunction) => ForgotPasswordService(req, res, next);
export const ResetPassword = (req: Request, res: Response, next: NextFunction) => ResetPasswordService(req, res, next);
export const GoogleLogin = (req: Request, res: Response, next: NextFunction) => GoogleLoginService(req, res, next);

// Secured routes
export const UserLogout = (req: Request, res: Response, next: NextFunction) => UserLogoutService(req, res, next);

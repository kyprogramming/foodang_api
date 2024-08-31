import { Request, Response, NextFunction } from "express";
import { AddUserService, CheckEmailExistService, UserRegisterService, UserLoginService } from "../services";

// export const VendorLogin = (req: Request, res: Response, next: NextFunction) => VendorLogin(req, res, next);

export const AddUser = (req: Request, res: Response, next: NextFunction) => AddUserService(req, res, next);
export const CheckEmailExist = (req: Request, res: Response, next: NextFunction) => CheckEmailExistService(req, res, next);
export const UserRegister = (req: Request, res: Response, next: NextFunction) => UserRegisterService(req, res, next);
export const UserLogin = (req: Request, res: Response, next: NextFunction) => UserLoginService(req, res, next);


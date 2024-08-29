import { Request, Response, NextFunction } from "express";
import { AddUserService } from "../services";

// export const VendorLogin = (req: Request, res: Response, next: NextFunction) => VendorLogin(req, res, next);

export const AddUser = (req: Request, res: Response, next: NextFunction) => AddUserService(req, res, next);

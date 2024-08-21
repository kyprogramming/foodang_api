import { Request, Response, NextFunction } from "express";
import { AddVendorService } from "../services";

// export const VendorLogin = (req: Request, res: Response, next: NextFunction) => VendorLogin(req, res, next);

export const AddVendor = (req: Request, res: Response, next: NextFunction) => AddVendorService(req, res, next);

import { Request, Response, NextFunction } from "express";
import { AddVendorService, GetVendorDataService, GetVendorsService } from "../services";

// export const VendorLogin = (req: Request, res: Response, next: NextFunction) => VendorLogin(req, res, next);

export const AddVendor = (req: Request, res: Response, next: NextFunction) => AddVendorService(req, res, next); 
export const GetVendors = (req: Request, res: Response, next: NextFunction) => GetVendorsService(req, res, next); 
export const GetVendorData = (req: Request, res: Response, next: NextFunction) => GetVendorDataService(req, res, next); 


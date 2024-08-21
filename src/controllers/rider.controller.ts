import { Request, Response, NextFunction } from "express";
import { AddOfferService, DeleteOfferService, EditOfferService, GetOffersService } from "../services";
import {
    GetRidersService
} from "../services";

export const GetRiders = (req: Request, res: Response, next: NextFunction) => GetRidersService(req, res, next);


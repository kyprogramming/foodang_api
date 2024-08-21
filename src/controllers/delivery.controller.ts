import { Request, Response, NextFunction } from "express";

import { DeliverySignUpService, DeliveryLoginService, GetDeliveryProfileService, EditDeliveryProfileService, UpdateDeliveryUserStatusService } from "../services/delivery.service";

export const DeliverySignUp = (req: Request, res: Response, next: NextFunction) => DeliverySignUpService(req, res, next);

export const DeliveryLogin = (req: Request, res: Response, next: NextFunction) => DeliveryLoginService(req, res, next);

export const GetDeliveryProfile = (req: Request, res: Response, next: NextFunction) => GetDeliveryProfileService(req, res, next);

export const EditDeliveryProfile = (req: Request, res: Response, next: NextFunction) => EditDeliveryProfileService(req, res, next);

export const UpdateDeliveryUserStatus = (req: Request, res: Response, next: NextFunction) => UpdateDeliveryUserStatusService(req, res, next);
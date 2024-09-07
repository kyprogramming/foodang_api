import { Request, Response, NextFunction } from "express";

import { GenerateSuccessResponse } from "../utility";

import createHttpError, { InternalServerError } from "http-errors";
import { Rider } from "../models/rider.model";

export const GetRidersService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const riders: any = await Rider.find();
        if (riders.length > 0) {
            const response = GenerateSuccessResponse(riders, 200, "data found.");
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "Data not found"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

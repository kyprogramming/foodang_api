import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import CustomError from "../errors/CustomError";
import  {envConfig}  from "../../config/env.config";



export const ValidateSignature = async (req: Request, res: any, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) return next(new CustomError(401, `"Error: Authorization token is missing.`));

    try {
        // Verify the token using the secret key
        const payload = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);
        (req as any).user = payload;
        next();
    } catch (error) {
        return next(new CustomError(401, `Error: Invalid or expired token [ValidateSignature]:  ${error.message}`));
        // return res.status(401).json({ message: "Invalid or expired token", error: error.message });
        // return next(createHttpError(401, `Invalid or expired token - ${error.message}`));
    }
};

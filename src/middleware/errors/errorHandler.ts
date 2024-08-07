import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../../interfaces";

export const errorHandlerMiddleware: ErrorRequestHandler = (error, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
    const statusCode = error.statusCode || 500;
    res?.status(statusCode).send({
        status: "failure",
        errors: error,
        message: error.message || "Internal Server Error",
        statusCode: statusCode,
        stack: process.env.NODE_ENV === "production" ? "" : error.stack,
    });
};

export default errorHandlerMiddleware;

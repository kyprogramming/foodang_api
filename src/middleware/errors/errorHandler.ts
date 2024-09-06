import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { IErrorResponse } from "../../interfaces";
import logger from "../../logger";

export const errorHandlerMiddleware: ErrorRequestHandler = (error, req: Request, res: Response<IErrorResponse>, next: NextFunction) => {
    const statusCode = error.statusCode || 500;
    logger.error({
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        statusCode: error.statusCode || "INTERNAL_ERROR",
        // stack: error.stack, code: error.code || "INTERNAL_ERROR",
        // requestDetails: req && { method: req.method, url: req.url, headers: req.headers, params: req.params, body: req.body, }, user: req && req.user && { id: req.user.id, username:
        //     req.user.username }, environment: process.env.NODE_ENV || "development", metadata: { memoryUsage: process.memoryUsage(), pid: process.pid, },
    });
    res?.status(statusCode).send({
        success: false,
        error: {
            details: error?.message,
            timestamp: new Date().toISOString(),
        },
        message: error.message || "Internal Server Error",
        statusCode: statusCode,
        stack: process.env.NODE_ENV === "production" ? "" : error.stack,
    });
};

export default errorHandlerMiddleware;

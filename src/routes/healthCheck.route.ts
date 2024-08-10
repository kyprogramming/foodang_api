import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response, next:NextFunction) => {
    const message = "Welcome to Rest API - 👋🌎🌍🌏 - health check confirm";
    // res.send(customResponse({ data: null, success: true, error: false, message, status: 200 }));
    res.json({  message });
});

export { router as HealthCheckRoute };

import { Request, NextFunction, Response } from "express";
import { AuthPayload, UserPayload } from "../dto";
import { ValidateSignature } from "../middleware/auth/authHandler";


declare global {
    namespace Express {
        interface User extends UserPayload {}
        interface Request {
            user?: UserPayload;
        }
    }
}

export const Authenticate = async (req: Request, res: any, next: NextFunction) => {
    await ValidateSignature(req, res, next);
    
    // if (signature) {
    //     return next();
    // } else {
    //     return res.json({ message: "User Not authorised" });
    // }
};

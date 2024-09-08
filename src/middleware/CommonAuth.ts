import { Request, NextFunction, Response } from "express";
import { AuthPayload, UserPayload } from "../dto";
import { ValidateSignature } from "../utility";

declare global {
    namespace Express {
        interface User extends UserPayload {}
        interface Request {
            user?: UserPayload;
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const signature = await ValidateSignature(req);
    if (signature) {
        return next();
    } else {
        return res.json({ message: "User Not authorised" });
    }
};

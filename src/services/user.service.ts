import { Request, Response, NextFunction } from "express";
import { CreateFoodInput } from "../dto";
import { GenerateResponseData, GenerateValidationErrorResponse, validateInput } from "../utility";

import createHttpError, { InternalServerError } from "http-errors";
import IUser from "../interfaces/IUser";
import { User } from "../models/user.model";

export const AddUserService = async (req: Request, res: Response, next: NextFunction) => {
    // const inputs = <CreateFoodInput>req.body; const errors = await validateInput(CreateFoodInput, inputs); if (errors.length > 0) return
    // res.status(400).json(GenerateValidationErrorResponse(errors));

    // const { name, description, category, foodType, readyTime, price } = inputs; const user = req.user;

    const sampleUser = req.body;

    try {
        const newUser = new User(sampleUser);
        const savedUser = await newUser.save();
        if (savedUser) {
            const response = GenerateResponseData(savedUser, "User added successfully", 201);
            return res.status(200).json(response);
        }

        console.log("User added:", newUser);
        return next(createHttpError(401, "Error while adding User"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

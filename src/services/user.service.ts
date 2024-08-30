import { Request, Response, NextFunction } from "express";
import { CheckEmailExistsInput, CreateFoodInput } from "../dto";
import { GenerateResponseData, GenerateValidationErrorResponse, validateInput } from "../utility";

import createHttpError, { InternalServerError } from "http-errors";
import IUser from "../interfaces/IUser";
import { User } from "../models/user.model";

export const AddUserService = async (req: Request, res: Response, next: NextFunction) => {
    // const inputs = <CreateFoodInput>req.body; const errors = await validateInput(CreateFoodInput, inputs); if (errors.length > 0) return
    // res.status(400).json(GenerateValidationErrorResponse(errors)); const { name, description, category, foodType, readyTime, price } = inputs; const user = req.user;

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

export const CheckEmailExistService = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = <CheckEmailExistsInput>(<unknown>req.params);
    const errors = await validateInput(CheckEmailExistsInput, { email });
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    try {
        if (email) {
            const user = await User.findOne({ email });
            let resp;
            if (user) {
                resp = { exists: true, message: "Provided email already exists, please continue with login." };
            } else {
                resp = { exists: false, message: "Provided email does not exist, please continue with register." };
            }
            const response = GenerateResponseData({ exists: resp.exists }, resp.message, 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(401, "Error while checking if email exist"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

import { Request, Response, NextFunction } from "express";
import { CreateFoodInput } from "../dto";
import { GenerateResponseData, GenerateValidationErrorResponse, validateInput } from "../utility";

import createHttpError, { InternalServerError } from "http-errors";
import IVendor from "../interfaces/IVendor";
import Vendor from "../models/vendor.model";

export const AddVendorService = async (req: Request, res: Response, next: NextFunction) => {
    // const inputs = <CreateFoodInput>req.body; const errors = await validateInput(CreateFoodInput, inputs); if (errors.length > 0) return
    // res.status(400).json(GenerateValidationErrorResponse(errors));

    // const { name, description, category, foodType, readyTime, price } = inputs; const user = req.user;

    const sampleVendor = req.body;

    try {
        const newVendor = new Vendor(sampleVendor);
        const savedVendor = await newVendor.save();
        if (savedVendor) {
            const response = GenerateResponseData(savedVendor, "Vendor added successfully", 201);
            return res.status(200).json(response);
        }

        console.log("Vendor added:", newVendor);
        return next(createHttpError(401, "Error while adding vendor"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

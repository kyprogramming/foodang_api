import { Request, Response, NextFunction } from "express";
import { CreateFoodInput } from "../dto";
import { GenerateSuccessResponse, GenerateValidationErrorResponse, validateInput } from "../utility";

import createHttpError, { InternalServerError } from "http-errors";
import IVendor from "../interfaces/IVendor";
import Vendor from "../models/vendor.model";

export const AddVendorService = async (req: Request, res: Response, next: NextFunction) => {
    // const inputs = <CreateFoodInput>req.body; const errors = await validateInput(CreateFoodInput, inputs); if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    // const { name, description, category, foodType, readyTime, price } = inputs; const user = req.user;

    const sampleVendor = req.body;

    try {
        const newVendor = new Vendor(sampleVendor);
        const savedVendor = await newVendor.save();
        if (savedVendor) {
            const response = GenerateSuccessResponse(savedVendor, 201, "Vendor added successfully");
            return res.status(200).json(response);
        }

        console.log("Vendor added:", newVendor);
        return next(createHttpError(401, "Error while adding vendor"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Get restaurants list
export const GetVendorsService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //  const page = parseInt(req.query.page) || 1; // Current page number from query parameters
        //  const pageSize = parseInt(req.query.pageSize) || 10; // Page size from query parameters
        //  const skip = (page - 1) * pageSize; // Skip for pagination
         const page = 1; // Current page number from query parameters
         const pageSize = 10; // Page size from query parameters
         const skip = (page - 1) * pageSize; // Skip for pagination

        // Fetch the vendors with pagination
        const vendors = await Vendor.find().select("name email id");//.skip(skip).limit(pageSize);
        const vendorsWithSeqNo = vendors.map((vendor, index) => ({
            seqNo: skip + index + 1, 
            ...vendor.toObject(),
        }));


        if (vendorsWithSeqNo) {
            const response = GenerateSuccessResponse(vendorsWithSeqNo, 200, "Vendor load successfully");
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "Error while loading vendor."));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

export const GetVendorDataService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendorId = req.params.id;

        // Fetch the vendors with pagination
        const vendor = await Vendor.find({_id:vendorId})

        if (vendor) {
            const response = GenerateSuccessResponse(vendor, 200, "Vendor load successfully");
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "Error while loading vendor."));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};


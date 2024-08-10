import express, { Request, Response, NextFunction } from "express";
import { Vendor } from "../models";
import { Offer } from "../models/offer.model";
import { IFood } from "../interfaces";
import { PostcodeInput } from "../dto";
import { GenerateResponseData, GenerateValidationErrorResponse, validateInput } from "../utility";
import createHttpError, { InternalServerError } from "http-errors";

/** GetFoodAvailabilityService
 * @param req @param res @param next @returns
 */
export const GetFoodAvailabilityService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <PostcodeInput>(<unknown>req.params);
    const errors = await validateInput(PostcodeInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { postcode } = inputs;

    try {
        const result = await Vendor.find({ postcode: postcode, serviceAvailable: true })
            .sort([["rating", "descending"]])
            .populate("foods");

        if (result.length > 0) {
            const response = GenerateResponseData(result, "data found.", 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(401, "data Not found!"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** GetTopRestaurantsService
 *
 * @param req
 * @param res @param next @returns
 */
export const GetTopRestaurantsService = async (req: Request, res: Response, next: NextFunction) => {
    const postcode = req.params.postcode;

    try {
        const result = await Vendor.find({ postcode: postcode, serviceAvailable: true })
            .sort([["rating", "descending"]])
            .limit(10);

        if (result.length > 0) {
            const response = GenerateResponseData(result, "Restaurants data found.", 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(401, "data Not found!"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** GetFoodsIn30MinService
 *
 * @param req
 * @param res @param next @returns
 */
export const GetFoodsIn30MinService = async (req: Request, res: Response, next: NextFunction) => {
    const postcode = req.params.postcode;

    try {
        const result = await Vendor.find({ postcode: postcode, serviceAvailable: true })
            .sort([["rating", "descending"]])
            .populate("foods");

        if (result.length > 0) {
            let foodResult: any = [];
            result.map((vendor) => {
                const foods = vendor.foods as [IFood];
                foodResult.push(...foods.filter((food) => food.readyTime <= 30));
            });
            const response = GenerateResponseData(foodResult, "Food data found.", 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "data Not found!"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};
/** SearchFoodsService
 *
 * @param req
 * @param res @param next @returns
 */
export const SearchFoodsService = async (req: Request, res: Response, next: NextFunction) => {
    const postcode = req.params.postcode;

    try {
        const result = await Vendor.find({
            postcode: postcode,
            serviceAvailable: true,
        }).populate("foods");

        if (result.length > 0) {
            let foodResult: any = [];
            result.map((item) => foodResult.push(...item.foods));
            const response = GenerateResponseData(foodResult, "Food data found.", 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "data not found"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** RestaurantByIdService
 *
 * @param req
 * @param res @param next @returns
 */
export const RestaurantByIdService = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
        const result = await Vendor.findById(id).populate("foods");

        if (result) {
            const response = GenerateResponseData(result, "Restaurant data found.", 200);
            return res.status(200).json(response);
        }

        return next(createHttpError(404, "data Not found!"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** GetAvailableOffersService
 *
 * @param req
 * @param res @param next @returns
 */
export const GetAvailableOffersService = async (req: Request, res: Response, next: NextFunction) => {
    const postcode = req.params.postcode;

    try {
        const offers = await Offer.find({ postcode: postcode, isActive: true });

        if (offers) {
            const response = GenerateResponseData(offers, "Offer data found.", 200);
            return res.status(200).json(response);
        }

        return next(createHttpError(404, "Offers not Found!"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

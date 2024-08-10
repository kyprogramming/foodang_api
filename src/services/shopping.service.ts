import express, { Request, Response, NextFunction } from "express";
import { Vendor } from "../models";
import { Offer } from "../models/offer.model";
import { IFood } from "../interfaces";
import { PostcodeInput } from "../dto";
import { GenerateResponseData, GenerateValidationErrorResponse, validateInput } from "../utility";
import createHttpError, { InternalServerError } from "http-errors";

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
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

export const GetTopRestaurantsService = async (req: Request, res: Response, next: NextFunction) => {
    const postcode = req.params.postcode;

    const result = await Vendor.find({ postcode: postcode, serviceAvailable: true })
        .sort([["rating", "descending"]])
        .limit(10);

    if (result.length > 0) {
        return res.status(200).json(result);
    }

    return res.status(404).json({ msg: "data Not found!" });
};

export const GetFoodsIn30MinService = async (req: Request, res: Response, next: NextFunction) => {
    const postcode = req.params.postcode;

    const result = await Vendor.find({ postcode: postcode, serviceAvailable: true })
        .sort([["rating", "descending"]])
        .populate("foods");

    if (result.length > 0) {
        let foodResult: any = [];
        result.map((vendor) => {
            const foods = vendor.foods as [IFood];
            foodResult.push(...foods.filter((food) => food.readyTime <= 30));
        });
        return res.status(200).json(foodResult);
    }

    return res.status(404).json({ msg: "data Not found!" });
};

export const SearchFoodsService = async (req: Request, res: Response, next: NextFunction) => {
    const postcode = req.params.postcode;
    const result = await Vendor.find({
        postcode: postcode,
        serviceAvailable: true,
    }).populate("foods");

    if (result.length > 0) {
        let foodResult: any = [];
        result.map((item) => foodResult.push(...item.foods));
        return res.status(200).json(foodResult);
    }
    return res.status(404).json({ msg: "data Not found!" });
};

export const RestaurantByIdService = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await Vendor.findById(id).populate("foods");

    if (result) {
        return res.status(200).json(result);
    }

    return res.status(404).json({ msg: "data Not found!" });
};

export const GetAvailableOffersService = async (req: Request, res: Response, next: NextFunction) => {
    const postcode = req.params.postcode;

    const offers = await Offer.find({ postcode: postcode, isActive: true });

    if (offers) {
        return res.status(200).json(offers);
    }

    return res.json({ message: "Offers not Found!" });
};

import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import { CartItem, CreateCustomerInput, CreateDeliveryUserInput, EditCustomerProfileInput, OrderInputs, UserLoginInput } from "../dto";
import { Customer, DeliveryUser, Food, Restaurant } from "../models";
import { Offer } from "../models";
import { Order } from "../models";
import { Transaction } from "../models";
import { GenerateOtp, GeneratePassword, GenerateResponseData, GenerateSalt, GenerateToken, GenerateValidationErrorResponse, SendOTP, validateInput, ValidatePassword } from "../utility";
import createHttpError, { InternalServerError } from "http-errors";

/** Delivery user signup
 * @param req @param res @param next @returns
 */
export const DeliverySignUpService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <CreateDeliveryUserInput>req.body;
    const errors = await validateInput(CreateDeliveryUserInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, phone, password, address, firstName, lastName, postcode } = inputs;

    try {
        const deliveryUser = await DeliveryUser.findOne({ email: email });
        if (deliveryUser) return next(createHttpError(401, "A Delivery User exist with the provided email ID."));

        const salt = await GenerateSalt();
        const userPassword = await GeneratePassword(password, salt);
        const result = await DeliveryUser.create({
            email: email,
            password: userPassword,
            salt: salt,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            address: address,
            postcode: postcode,
            verified: false,
            lat: 0,
            lng: 0,
        });

        if (result) {
            const signature = await GenerateToken({
                _id: result._id,
                email: result.email,
                verified: result.verified,
            });
            const response = GenerateResponseData(signature, "User created", 201);
            return res.status(201).json(response);
        }
        return next(createHttpError(401, "Error while creating Delivery user"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Delivery Login Service
 * @param req @param res @param next @returns
 */
export const DeliveryLoginService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <UserLoginInput>req.body;
    const errors = await validateInput(UserLoginInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, password } = inputs;

    try {
        const deliveryUser = await DeliveryUser.findOne({ email: email });
        if (deliveryUser) {
            const validation = await ValidatePassword(password, deliveryUser.password, deliveryUser.salt);

            if (validation) {
                const signature = await GenerateToken({
                    _id: deliveryUser._id,
                    email: deliveryUser.email,
                    verified: deliveryUser.verified,
                });

                const data = {
                    signature,
                    email: deliveryUser.email,
                    verified: deliveryUser.verified,
                };

                const response = GenerateResponseData(data, "Login successful.", 200);
                return res.status(200).json(response);
            }
        }
        return res.json({ msg: "Error Login" });
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Get Delivery User Profile Service
 * @param req @param res @param next @returns
 */
export const GetDeliveryProfileService = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUser = req.user;

    try {
        if (deliveryUser) {
            const profile = await DeliveryUser.findById(deliveryUser._id);

            if (profile) {
                const response = GenerateResponseData(profile, "Profile data found.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(404, "data not found"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** EditDeliveryProfileService
 *
 * @param req
 * @param res @param next @returns
 */
export const EditDeliveryProfileService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <EditCustomerProfileInput>req.body;
    const errors = await validateInput(EditCustomerProfileInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { firstName, lastName, address } = inputs;
    const deliveryUser = req.user;

    try {
        if (deliveryUser) {
            const profile = await DeliveryUser.findById(deliveryUser._id);

            if (profile) {
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                const result = await profile.save();

                const response = GenerateResponseData(result, "Profile data updated.", 201);
                return res.status(201).json(response);
            }
        }
        return next(createHttpError(400, "Error while Updating Profile"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/* ------------------- Delivery Notification --------------------- */
/** Update Delivery User Status Service
 * @param req @param res @param next @returns
 */
export const UpdateDeliveryUserStatusService = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUser = req.user;

    try {
        if (deliveryUser) {
            const { lat, lng } = req.body;

            const profile = await DeliveryUser.findById(deliveryUser._id);

            if (profile) {
                if (lat && lng) {
                    profile.lat = lat;
                    profile.lng = lng;
                }

                profile.isAvailable = !profile.isAvailable;

                const result = await profile.save();

                const response = GenerateResponseData(result, "profile status updated", 201);
                return res.status(201).json(response);
            }
        }
        return next(createHttpError(401, "Error while Updating Profile"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

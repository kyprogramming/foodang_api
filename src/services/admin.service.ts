import { RequestHandler, Request, Response, NextFunction } from "express";
import { SignupAdminInput, CreateRestaurantInput, AdminLoginInput, VerifyDeliveryUserInput } from "../dto";
import { DeliveryUser, Restaurant } from "../models";
import { Transaction } from "../models";
import {
    customResponse,
    GeneratePassword,
    GenerateSuccessResponse,
    GenerateSalt,
    GenerateToken,
    GenerateValidationErrorResponse,
    isValidMongooseObjectId,
    ValidatePassword,
    validateInput,
} from "../utility";
import { Admin } from "../models/admin.model";
import { envConfig, sendEmail } from "../config";
import createHttpError, { InternalServerError } from "http-errors";
import { errorMsg, successMsg } from "../constants/admin.constant";

/** Admin Signup Service
 * @param req @param res @param next @returns
 */
export const SignupAdminService: RequestHandler = async (req, res, next) => {
    const inputs = <SignupAdminInput>req.body;
    const errors = await validateInput(SignupAdminInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { name, address, email, password, phone } = inputs;

    try {
        const existingAdmin = await FindAdmin(undefined, email);
        if (existingAdmin) {
            return next(createHttpError(409, errorMsg.admin_already_exist));
        }

        const salt = await GenerateSalt();
        const adminPassword = await GeneratePassword(password, salt);
        const createdAdmin = await Admin.create({
            name: name,
            address: address,
            email: email,
            password: adminPassword,
            salt: salt,
            phone: phone,
        });

        // TODO: send mail // await sendEmail();
        const response = GenerateSuccessResponse(createdAdmin, 200, successMsg.admin_create_success);
        return res.status(200).json(response);
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** Admin Login Service
 * @param req @param res @param next @returns
 */
export const AdminLoginService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <AdminLoginInput>req.body;
    const errors = await validateInput(AdminLoginInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, password } = inputs;

    try {
        const existingUser = await FindAdmin(undefined, email);
        if (existingUser) {
            const validation = await ValidatePassword(password, existingUser.password, existingUser.salt);
            if (validation) {
                const signature = await GenerateToken({
                    _id: existingUser._id,
                    email: existingUser.email,
                    name: existingUser.name,
                });

                // const data = GenerateSuccessResponse(signature, "POST", "Admin login", "admin/login");
                const response = GenerateSuccessResponse(signature, 200, successMsg.admin_auth_success);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, errorMsg.admin_auth_error));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

export const AdminLogoutService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <AdminLoginInput>req.body;
    const errors = await validateInput(AdminLoginInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, password } = inputs;

    try {
        const existingUser = await FindAdmin(undefined, email);
        if (existingUser) {
            const validation = await ValidatePassword(password, existingUser.password, existingUser.salt);
            if (validation) {
                const signature = await GenerateToken({
                    _id: existingUser._id,
                    email: existingUser.email,
                    name: existingUser.name,
                });

                // const data = GenerateSuccessResponse(signature, "POST", "Admin login", "admin/login");
                const response = GenerateSuccessResponse(signature, 200, successMsg.admin_auth_success);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, errorMsg.admin_auth_error));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

//  Create new restaurant
export const CreateRestaurantService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <CreateRestaurantInput>req.body;
    const errors = await validateInput(CreateRestaurantInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { name, address, postcode, foodType, email, password, ownerName, phone } = <CreateRestaurantInput>req.body;

    try {
        const restaurant = await FindRestaurant("", email);
        if (restaurant !== null) {
            return next(createHttpError(422, `Restaurant email - ${email} is already exists.`));
        }

        //generate a salt
        const salt = await GenerateSalt();
        // encrypt the password using the salt
        const userPassword = await GeneratePassword(password, salt);

        const newRestaurant = await Restaurant.create({
            name: name,
            address: address,
            postcode: postcode,
            foodType: foodType,
            email: email,
            password: userPassword,
            salt: salt,
            ownerName: ownerName,
            phone: phone,
            rating: 0,
            serviceAvailable: false,
            coverImages: [],
            lat: 0,
            lng: 0,
        });

        const response = GenerateSuccessResponse(newRestaurant, 200, successMsg.restaurant_create_success);
        return res.status(200).json(response);
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Get restaurants list
export const GetRestaurantsService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurants = await Restaurant.find();
        if (restaurants) {
            const response = GenerateSuccessResponse(restaurants, 200, successMsg.restaurant_create_success);
            return res.status(200).json(response);
        }
        return next(createHttpError(404, errorMsg.restaurant_not_found));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Get restaurant by id
export const GetRestaurantByIDService = async (req: Request, res: Response, next: NextFunction) => {
    const restaurantId = req.params.id;
    if (!isValidMongooseObjectId(restaurantId)) return next(createHttpError(422, `Invalid request parameter`));

    try {
        const restaurant = await FindRestaurant(restaurantId);
        if (restaurant) {
            const response = GenerateSuccessResponse(restaurant, 200, successMsg.restaurant_found_success);
            return res.status(200).json(response);
        }
        return next(createHttpError(404, errorMsg.restaurant_not_found));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Get transactions list
export const GetTransactionsService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transactions = await Transaction.find();
        if (transactions) {
            const response = GenerateSuccessResponse(transactions, 200, "Transactions data  found");
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "Transactions data not available"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Get transactions by id
export const GetTransactionByIdService = async (req: Request, res: Response, next: NextFunction) => {
    const transId = req.params.id;
    if (!isValidMongooseObjectId(transId)) return next(createHttpError(422, `Invalid request parameter`));

    try {
        const transaction = await Transaction.findById(transId);
        if (transaction) {
            const response = GenerateSuccessResponse(transaction, 200, "Transaction data  found");
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "Transactions data not available"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Verify delivery user
export const VerifyDeliveryUserService = async (req: Request, res: Response, next: NextFunction) => {
    const { _id, status } = req.body;
    const inputs = <VerifyDeliveryUserInput>req.body;
    const errors = await validateInput(VerifyDeliveryUserInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    try {
        const profile = await DeliveryUser.findById(_id);

        if (profile) {
            profile.verified = status;
            const result = await profile.save();

            const response = GenerateSuccessResponse(result, 200, "Transaction data  found");
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "Unable to verify Delivery User"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Get delivery user profile
export const GetDeliveryUsersService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryUsers = await DeliveryUser.find();
        if (deliveryUsers) {
            const response = GenerateSuccessResponse(deliveryUsers, 200, "Transaction data  found");
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "Unable to get Delivery Users"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Find Admin profile Find Admin by email address and id
export const FindAdmin = async (id: String | undefined = "", email: string = "") => {
    if (email) {
        // return await Admin.findOne({ email: email }, "_id").exec().lean();
        return await Admin.findOne({ email: email });
    } else {
        return await Admin.findById(id);
    }
};

// Find Restaurant by email address and id
export const FindRestaurant = async (id: String | undefined, email?: string) => {
    if (email) {
        return await Restaurant.findOne({ email: email });
    } else {
        return await Restaurant.findById(id);
    }
};

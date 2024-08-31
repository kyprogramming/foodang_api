import { Request, Response, NextFunction, RequestHandler } from "express";
import { CheckEmailExistsInput, CreateFoodInput, UserLoginInput, UserRegisterInput } from "../dto";
import {
    GenerateAccessToken,
    GeneratePassword,
    GenerateRefreshToken,
    GenerateResponseData,
    GenerateSalt,
    GenerateToken,
    GenerateValidationErrorResponse,
    validateInput,
    ValidatePassword,
} from "../utility";

import createHttpError, { InternalServerError } from "http-errors";
import IUser from "../interfaces/IUser";
import { User } from "../models/user.model";
import { errorMsg, successMsg } from "../constants/user.constant";

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

export const UserRegisterService: RequestHandler = async (req, res, next) => {
    const inputs = <UserRegisterInput>req.body;
    const errors = await validateInput(UserRegisterInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { name, email, password, mobile, callingCode } = inputs;

    try {
        const salt = await GenerateSalt();
        const passwordHash = await GeneratePassword(password, salt);
        const newUser = await User.create({
            name: name,
            email: email,
            passwordHash: passwordHash,
            salt: salt,
            mobile: mobile,
            callingCode: callingCode,
        });

        // TODO: send mail // await sendEmail();
        const response = GenerateResponseData(newUser, successMsg.user_create_success, 200);
        return res.status(200).json(response);
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

export const UserLoginService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <UserLoginInput>req.body;
    const errors = await validateInput(UserLoginInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, password } = inputs;

    try {
        const user = await FindUser(undefined, email);
        if (user) {
            const validation = await ValidatePassword(password, user.passwordHash, user.salt);
            if (validation) {
                const accessToken = await GenerateAccessToken({ _id: user._id });
                const refreshToken = await GenerateRefreshToken({ _id: user._id });

                // const data = GenerateResponseData(signature, "POST", "Admin login", "admin/login");
                const response = GenerateResponseData(
                    {
                        accessToken,
                        refreshToken,
                        user: { id: user._id, name: user.name, email: user.email },
                    },
                    successMsg.user_auth_success,
                    200
                );
                // update social auth data
                const socialAuthData = { provider: "email" as "email", providerId: user.email, accessToken: accessToken, refreshToken: refreshToken };
                await updateOrAddSocialAuth(user, socialAuthData);
                return res.status(200).json(response);
            } else {
                return next(createHttpError(401, errorMsg.user_auth_error));
            }
        }
        return next(createHttpError(401, errorMsg.user_not_found));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Find Admin profile Find Admin by email address and id
export const FindUser = async (id: String | undefined = "", email: string = "") => {
    if (email) {
        // return await Admin.findOne({ email: email }, "_id").exec().lean();
        return await User.findOne({ email: email });
    } else {
        return await User.findById(id);
    }
};

const updateOrAddSocialAuth = async (user, socialAuthData) => {
    try {
        const existingAuth = user.socialAuth.find((auth) => auth.provider === socialAuthData.provider);
        if (existingAuth) {
            // Update existing social auth method
            existingAuth.providerId = socialAuthData.providerId;
            existingAuth.accessToken = socialAuthData.accessToken;
            existingAuth.refreshToken = socialAuthData.refreshToken;
        } else {
            // Add new social auth method
            user.socialAuth.push(socialAuthData);
        }

        await user.save();
        return user;
    } catch (error) {
        console.error("Error updating or adding social auth:", error);
        throw error;
    }
};

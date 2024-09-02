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
    GenerateOTP,
} from "../utility";

import createHttpError, { InternalServerError } from "http-errors";
import IUser from "../interfaces/IUser";
import { User } from "../models/user.model";
import { errorMsg, successMsg } from "../constants/user.constant";
import { OAuth2Client } from "google-auth-library";

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
            let user = await User.findOne({
                email: email,
                authProvider: { $in: ["email"] },
            });
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
        let user = await User.findOne({
            email: email,
        });
        const salt = await GenerateSalt();
        const passwordHash = await GeneratePassword(password, salt);
        // const refreshToken = GenerateRefreshToken();
        const emailOtp = GenerateOTP();
        const emailOtpExpiry = new Date(new Date().getTime() + 10 * 60000);
        if (user) {
            user.name = name;
            user.password = passwordHash;
            user.mobile = mobile;
            user.salt = salt;
            user.callingCode = callingCode;
            user.emailOtp = emailOtp;
            user.emailOtpExpiry = emailOtpExpiry;
            user.authProvider.push("email");
            // user.refreshToken = refreshToken;
            user.save();
        } else {
            user = await User.create({
                name,
                email,
                password: passwordHash,
                salt,
                mobile,
                callingCode,
                emailOtp,
                emailOtpExpiry,
                // refreshToken,
                authProvider: ["email"],
            });
        }
        const response = GenerateResponseData(user, successMsg.user_create_success, 200);
        return res.status(200).json(response);

        // TODO: send mail // await sendEmail();
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

export const VerifyEmailOTPService = async (req: Request, res: Response, next: NextFunction) => {
    // const inputs = <UserLoginInput>req.body; const errors = await validateInput(UserLoginInput, inputs); if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));
    // TODO: validate OTP
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) return next(createHttpError(404, "User not found."));

        if (user.emailOtp !== otp && user.emailOtpExpiry > new Date(new Date().getTime())) {
            return next(createHttpError(400, "OTP does not match or expired. Please request a new OTP"));
        }
        user.emailVerified = true;
        user.emailOtp = undefined;
        user.emailOtpExpiry = undefined;
        user.save();
        const response = GenerateResponseData({}, successMsg.user_email_verify_success, 200);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error verifying Google ID token:", error);
        return next(InternalServerError(error.message));
    }
};

export const UserLoginService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <UserLoginInput>req.body;
    const errors = await validateInput(UserLoginInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, password } = inputs;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const validation = await ValidatePassword(password, user.password, user.salt);
            if (validation) {
                const accessToken = await GenerateAccessToken({ _id: user._id });
                const refreshToken = await GenerateRefreshToken();

                user.refreshToken = refreshToken;
                user.save();
                const responseData = {
                    user: { id: user._id, name: user.name, email: user.email },
                    accessToken,
                    refreshToken,
                };
                const response = GenerateResponseData(responseData, successMsg.user_auth_success, 200);
                return res.status(200).json(response);
            } else {
                return next(createHttpError(401, "Credentials are not valid."));
            }
        } else {
            return next(createHttpError(404, errorMsg.user_not_found));
        }
    } catch (error: any) {
        console.log(error);
        return next(InternalServerError(error.message));
    }
};

export const GoogleLoginService = async (req: Request, res: Response, next: NextFunction) => {
    // const inputs = <UserLoginInput>req.body; const errors = await validateInput(UserLoginInput, inputs); if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    // TODO: validate idToken
    const { idToken } = req.body;
    try {
        const { user, refreshToken } = await findOrCreateUser(idToken);
        const accessToken = await GenerateAccessToken({ _id: user._id });
        const response = GenerateResponseData({ user, accessToken, refreshToken }, successMsg.user_auth_success, 200);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error verifying Google ID token:", error);
        return next(InternalServerError(error.message));
    }
};

// Secured Services
export const UserLogoutService = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: validate user id
    const id = req.user._id;
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            user.refreshToken = undefined;
            user.save();
            const response = GenerateResponseData({}, successMsg.user_logout_success, 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(404, errorMsg.user_not_found));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

export const FindUser = async (id: String | undefined = "", email: string = "") => {
    if (email) {
        // return await Admin.findOne({ email: email }, "_id").exec().lean();
        return await User.findOne({ email: email });
    } else {
        return await User.findById(id);
    }
};

async function findOrCreateUser(idToken: string) {
    const client = new OAuth2Client("498117270511-dfrl1g10qhv935j52vvbbhtsibkssjpe.apps.googleusercontent.com");
    try {
        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: "498117270511-dfrl1g10qhv935j52vvbbhtsibkssjpe.apps.googleusercontent.com",
        });

        const googlePayload = ticket.getPayload();
        const { sub, email, name, email_verified, picture } = googlePayload;
        // console.log("GOOGLE PAYLOAD:", payload);

        if (!email_verified) {
            throw new Error("Your email is not verified with Google. Please verify your email and try again.");
        }

        const refreshToken = GenerateRefreshToken();

        // Check if the user already exists by email
        let user = await User.findOne({ email });
        if (user) {
            if (!user.googleId) {
                user.googleId = sub;
                user.name = name;
                user.authProvider.push("google");
                user.refreshToken = refreshToken;
                user.emailVerified = email_verified;
                user.profilePicture = picture;
                await user.save();
            }
        } else {
            user = new User({
                googleId: sub,
                email,
                name,
                authProvider: ["google"],
                emailVerified: email_verified,
                profilePicture: picture,
                refreshToken: refreshToken,
            });
            await user.save();
        }
        // Return the user object (optionally generate and return JWT tokens)
        return { user, refreshToken };
    } catch (error) {
        console.error("ERROR: findOrCreateUser: ", error);
        throw new Error("Failed while authenticating user in Google ");
    }
}

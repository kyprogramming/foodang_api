import { Request, Response, NextFunction, RequestHandler } from "express";
import { CheckEmailExistsInput, CreateFoodInput, UserLoginInput, UserRegisterInput } from "../dto";
import {
    GenerateAccessToken,
    GeneratePassword,
    GenerateRefreshToken,
    GenerateSuccessResponse,
    GenerateSalt,
    GenerateToken,
    GenerateValidationErrorResponse,
    validateInput,
    ValidatePassword,
    GenerateOTP,
    SendOTP,
    GenerateOtp,
} from "../utility";

import createHttpError, { InternalServerError } from "http-errors";
import IUser from "../interfaces/IUser";
import { User } from "../models/user.model";
import { SuccessMessages, ErrorMessages } from "../constants/user.messages";
import { OAuth2Client } from "google-auth-library";
import IOtp from "../interfaces/IOtp";
import { Otp } from "../models";

export const AddUserService = async (req: Request, res: Response, next: NextFunction) => {
    // const inputs = <CreateFoodInput>req.body; const errors = await validateInput(CreateFoodInput, inputs); if (errors.length > 0) return
    // res.status(400).json(GenerateValidationErrorResponse(errors)); const { name, description, category, foodType, readyTime, price } = inputs; const user = req.user;

    const sampleUser = req.body;
    try {
        const newUser = new User(sampleUser);
        const savedUser = await newUser.save();
        if (savedUser) {
            const response = GenerateSuccessResponse(savedUser, 201, "User added successfully");
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
            let user = await User.findOne({ email: email, authMethods: { $in: ["password"] } });
            let resp;
            if (user) {
                resp = { exists: true, message: ErrorMessages.USER_ALREADY_EXIST};
            } else {
                resp = { exists: false, message: ErrorMessages.USER_NOT_FOUND };
            }
            const data = { exists: resp.exists };
            const response = GenerateSuccessResponse(data, 200, resp.message);
            return res.status(200).json(response);
        }
        return next(createHttpError(401, ErrorMessages.USER_VERIFY_ERROR));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// User OTP request to sent OTP on mobile device
export const SendOtpService = async (req: Request, res: Response, next: NextFunction) => {
    const { email, mobile, callingCode } = req.body;
    try {
        if (email && callingCode && mobile) {
            // Insert OTP into the database
            let generateOtp;
            let otpObj: any = await Otp.findOne({ email, mobile, callingCode });
            if (otpObj) {
                if (new Date() > otpObj.expireAt) {
                    generateOtp = GenerateOtp(); // generate new OTP once expired
                    otpObj.opt = generateOtp.otp;
                    otpObj.expireAt = generateOtp.expireAt;
                    await otpObj.save();
                }
            } else {
                generateOtp = GenerateOtp(); // generate new OTP once expired
                const otpPayload: any = { email, mobile, callingCode, otp: generateOtp.otp, expireAt: generateOtp.expireAt };
                const newOTP = new Otp(otpPayload);
                await newOTP.save();
            }
            //! TODO:  uncomment below lines to sent OTP to mobile device

            // const sendCode = await SendOTP(generateOtp.otp, callingCode, mobile);

            // if (!sendCode) return next(createHttpError(401, "Failed to verify your phone number"));

            const response = GenerateSuccessResponse(null, 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(401, "Error with Requesting OTP"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

export const VerifyMobileOtpAndRegisterService = async (req: Request, res: Response, next: NextFunction) => {
    const { email, displayName, password, callingCode, mobile, mobileOtp } = req.body;
    try {
        if (email && callingCode && mobile) {
            const otpObj: any = await Otp.findOne({ email, mobile, callingCode });
            if (otpObj) {
                const otp = otpObj.otp;
                if (mobileOtp === otp) {
                    if (new Date() > otpObj.expireAt) {
                        return next(createHttpError(401, ErrorMessages.USER_EXPIRED_OTP));
                    } else {
                        let user = await User.findOne({ email: email });
                        const salt = await GenerateSalt();
                        const passwordHash = await GeneratePassword(password, salt);
                        if (user) {
                            if (!user.authMethods.includes("password")) {
                                user.authMethods.push("password");
                                user.salt = salt;
                                user.password = passwordHash;
                                user.displayName = displayName;
                                user.mobile = mobile;
                                user.callingCode = callingCode;
                                user.mobileVerified = true;
                                await user.save();
                            }
                        } else {
                            await User.create({
                                displayName,
                                email,
                                password: passwordHash,
                                salt,
                                mobile,
                                callingCode,
                                mobileVerified: true,
                                authMethods: ["password"],
                            });
                        }
                    }
                    await Otp.deleteOne({ email, mobile, callingCode });
                } else {
                    return next(createHttpError(400, "Verification failed, OTP doesn't match"));
                }
            }
            const response = GenerateSuccessResponse(null, 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(500, "Failed to register user, please try again later"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

export const UserRegisterService: RequestHandler = async (req, res, next) => {
    const inputs = <UserRegisterInput>req.body;
    const errors = await validateInput(UserRegisterInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { displayName, email, password, mobile, callingCode } = req.body;
    console.log(displayName, email, password, mobile, callingCode);
    try {
        let user = await User.findOne({ email: email, authMethods: { $in: ["password"] } });
        if (user && user.mobileVerified) return next(createHttpError(409, "User already exists with a verified email id."));
        if (user && !user.mobileVerified) return next(createHttpError(403, "User already exists, however otp not verified yet."));

        const salt = await GenerateSalt();
        const passwordHash = await GeneratePassword(password, salt);
        // const emailOtp = GenerateOTP(); const emailOtpExpiry = new Date(new Date().getTime() + 10 * 60000);
        if (!user) {
            user = await User.create({
                displayName,
                email,
                password: passwordHash,
                salt,
                mobile,
                callingCode,
                authMethods: ["password"],
            });

            // Generate OTP and send OTP to mobile
            const { otp, expireAt } = GenerateOtp();
            // const sendCode = await SendOTP(otp, callingCode, mobile);

            // if (!sendCode) return next(createHttpError(401, "Failed to verify your phone number"));

            // Insert OTP into the database
            const otpPayload: any = { email, mobile, callingCode, otp, expireAt };
            const newOTP = new Otp(otpPayload);
            await newOTP.save();

            const response = GenerateSuccessResponse(null, 200);
            return res.status(200).json(response);
        } else {
        }

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
        const response = GenerateSuccessResponse(null, 200);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error verifying Google ID token:", error);
        return next(InternalServerError(error.message));
    }
};

export const EmailLoginService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <UserLoginInput>req.body;
    const errors = await validateInput(UserLoginInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, password } = inputs;
    try {
        const user = await User.findOne({ email: email, authMethods: { $in: ["password"] } });
        if (user) {
            const validation = await ValidatePassword(password, user.password, user.salt);
            if (validation) {
                const accessToken = await GenerateAccessToken({ _id: user._id });
                const refreshToken = await GenerateRefreshToken();
                user.lastLogin = Date.now();
                user.refreshToken = refreshToken;
                user.save();
                const data = {
                    user: { id: user._id, name: user.displayName, email: user.email },
                    accessToken,
                    refreshToken,
                };
                const response = GenerateSuccessResponse(data, 200, SuccessMessages.USER_AUTH_SUCCESS);
                return res.status(200).json(response);
            } else {
                return next(createHttpError(400, ErrorMessages.USER_INVALID_CREDENTIALS));
            }
        } else {
            return next(createHttpError(404, ErrorMessages.USER_NOT_FOUND));
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
        const response = GenerateSuccessResponse({ user, accessToken, refreshToken }, 200);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error verifying Google ID token:", error);
        return next(InternalServerError(error.message));
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
            if (user.authMethods.includes("google")) {
                user.refreshToken = refreshToken;
                user.lastLogin = Date.now();
                await user.save();
            } else {
                user.authMethods.push("google");
                user.refreshToken = refreshToken;
                user.lastLogin = Date.now();
                user.providers = [{ providerName: "google", providerId: sub, providerPhotoURL: picture, profileName: name }]; // add provider
                await user.save();
            }
        } else {
            user = new User({
                email,
                displayName: name,
                authMethods: ["google"],
                emailVerified: email_verified,
                refreshToken: refreshToken,
                lastLogin: Date.now(),
                providers: [{ providerName: "google", providerId: sub, providerPhotoURL: picture, profileName: name }],
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

// Secured Services
export const UserLogoutService = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: validate user id
  const id = req.user._id;
  console.log('User Id logged out', id);
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            user.refreshToken = undefined;
            user.save();
            const response = GenerateSuccessResponse(null, 200, SuccessMessages.USER_LOGOUT_SUCCESS);
            return res.status(200).json(response);
        }
        return next(createHttpError(404, ErrorMessages.USER_NOT_FOUND));
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

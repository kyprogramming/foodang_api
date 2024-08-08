import { RequestHandler, Request, Response, NextFunction } from "express";
import { SignupAdminInput, CreateVendorInput } from "../dto";
import { DeliveryUser, Vendor } from "../models";
import { Transaction } from "../models";
import { customResponse, GeneratePassword, GenerateResponseData, GenerateSalt, GenerateSignature, GenerateValidationErrorResponse, ValidatePassword } from "../utility";
import { Admin } from "../models/Admin";
import { AdminLoginInput } from "../dto/Admin.dto";
import { envConfig, sendEmail } from "../config";
import { validateInput } from "../utility";
import createHttpError, { InternalServerError } from "http-errors";
import { errorMsg, successMsg } from "../constants/admin.constant";

/** Admin Signup Service
 * @param req @param res @param next @returns
 */
export const SignupAdminService: RequestHandler = async (req, res, next) => {
    const inputs = <SignupAdminInput>req.body;
    const errors = await validateInput(SignupAdminInput, inputs);
    if (errors.length > 0) {
        return res.status(400).json(GenerateValidationErrorResponse(errors));
    }
    const { name, address, email, password, phone } = inputs;

    try {
        // find existing admin user
        const existingAdmin = await FindAdmin("", email);
        if (existingAdmin) {
            return res.json({ message: errorMsg.admin_already_exist });
        }

        //generate a salt
        const salt = await GenerateSalt();
        const adminPassword = await GeneratePassword(password, salt);

        // encrypt the password using the salt
        const createdAdmin = await Admin.create({
            name: name,
            address: address,
            email: email,
            password: adminPassword,
            salt: salt,
            phone: phone,
        });

        // TODO: send mail // await sendEmail();

        const data = {
            ...createdAdmin.toJSON(),
            request: {
                type: "POST",
                description: "Create a admin user",
                url: `${process.env.API_URL}/api/${process.env.API_VERSION}/admin/user`,
            },
        };

        return res.status(200).json(
            customResponse<typeof data>({
                success: true,
                message: successMsg.admin_create_success,
                statusCode: 200,
            })
        );
    } catch (error) {
        return next(InternalServerError);
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
        const existingUser = await FindAdmin("", email);
        if (existingUser) {
            const validation = await ValidatePassword(password, existingUser.password, existingUser.salt);
            if (validation) {
                const signature = await GenerateSignature({
                    _id: existingUser._id,
                    email: existingUser.email,
                    name: existingUser.name,
                });

                // const data = GenerateResponseData(signature, "POST", "Admin login", "admin/login");
                const data = GenerateResponseData(signature);
                return res.status(200).json(
                    customResponse<typeof data>({
                        success: true,
                        data,
                        message: successMsg.admin_auth_success,
                        statusCode: 200,
                    })
                );
            }
        }
        return next(createHttpError(401, errorMsg.admin_auth_error));
    } catch (error) {
        return next(InternalServerError);
    }
};

//  Create a new vendor
export const CreateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <CreateVendorInput>req.body;
    const errors = await validateInput(CreateVendorInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { name, address, pincode, foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body;

    try {
        const vendor = await FindVendor("", email);
        if (vendor !== null) {
            return next(createHttpError(422, `Vendor email - ${email} is already exists.`));
        }

        //generate a salt
        const salt = await GenerateSalt();
        const userPassword = await GeneratePassword(password, salt);

        // encrypt the password using the salt
        const newVendor = await Vendor.create({
            name: name,
            address: address,
            pincode: pincode,
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

        const data = GenerateResponseData(newVendor);
        return res.status(200).json(
            customResponse<typeof data>({
                success: true,
                data,
                message: successMsg.vendor_create_success,
                statusCode: 200,
            })
        );
    } catch (error) {
        return next(InternalServerError);
    }
};

// Find Vendor by email address and id
export const FindVendor = async (id: String | undefined, email?: string) => {
    if (email) {
        return await Vendor.findOne({ email: email });
    } else {
        return await Vendor.findById(id);
    }
};

// Get a list of all the available vendors
export const GetVendorsService = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find();

    if (vendors !== null) {
        return res.json(vendors);
    }

    return res.json({ message: "Vendors data not available" });
};

// Get vendor by id
export const GetVendorByIDService = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;
    const vendors = await FindVendor(vendorId);

    if (vendors !== null) {
        return res.json(vendors);
    }

    return res.json({ message: "Vendors data not available" });
};

// Get transactions
export const GetTransactionsService = async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await Transaction.find();
    if (transactions) {
        return res.status(200).json(transactions);
    }

    return res.json({ message: "Transactions data not available" });
};

// Get transactions by id
export const GetTransactionByIdService = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const transaction = await Transaction.findById(id);

    if (transaction) {
        return res.status(200).json(transaction);
    }

    return res.json({ message: "Transaction data not available" });
};

// Verify delivery user
export const VerifyDeliveryUserService = async (req: Request, res: Response, next: NextFunction) => {
    const { _id, status } = req.body;

    if (_id) {
        const profile = await DeliveryUser.findById(_id);

        if (profile) {
            profile.verified = status;
            const result = await profile.save();

            return res.status(200).json(result);
        }
    }
    return res.json({ message: "Unable to verify Delivery User" });
};

// Get delivery user profile
export const GetDeliveryUsersService = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUsers = await DeliveryUser.find();

    if (deliveryUsers) {
        return res.status(200).json(deliveryUsers);
    }

    return res.json({ message: "Unable to get Delivery Users" });
};

/** Find Admin profile Find Admin by email address and id
 * @param id @param email @returns
 */
export const FindAdmin = async (id: String | undefined, email?: string) => {
    if (email) {
        // return await Admin.findOne({ email: email }, "_id").exec();
        return await Admin.findOne({ email: email }).exec();
    } else {
        return await Admin.findById(id);
    }
};

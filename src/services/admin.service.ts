import { RequestHandler, Request, Response, NextFunction } from "express";
import { SignupAdminInput, CreateVendorInput } from "../dto";
import { DeliveryUser, Vendor } from "../models";
import { Transaction } from "../models/Transaction";
import { customResponse, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";
import { Admin } from "../models/Admin";
import { AdminLoginInput } from "../dto/Admin.dto";
import { sendEmail } from "../config";
import { validateInput } from "../utility";
import createHttpError, { InternalServerError } from "http-errors";

export const SignupAdminService: RequestHandler = async (req, res, next) => {
    const signUpInput = req.body;
    const errors = await validateInput(SignupAdminInput, signUpInput);
    if (errors.length > 0) {
        return res.status(400).json(
            customResponse({
                status: "failure",
                errors: errors.map((err) => ({ property: err.property, error: err.constraints })),
                message: `Validation error`,
                statusCode: 400,
            })
        );
    }

    const { name, address, email, password, phone } = signUpInput;

    try {
        // find existing admin user
        const existingAdmin = await FindAdmin("", email);
        if (existingAdmin) {
            return res.json({ message: "An admin is exist with this email ID" });
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
                status: "success",
                message: `Successfully admin user has been created.`,
                statusCode: 200,
            })
        );
    } catch (error) {
        return next(InternalServerError);
    }
};

// Find Vendor by email address and id
export const FindAdmin = async (id: String | undefined, email?: string) => {
    if (email) {
        return await Admin.findOne({ email: email }, "_id").exec();
    } else {
        return await Admin.findById(id);
    }
};

//  Vendor login
export const AdminLoginService = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <AdminLoginInput>req.body;

    const existingUser = await FindAdmin("", email);

    if (existingUser !== null) {
        const validation = await ValidatePassword(password, existingUser.password, existingUser.salt);
        if (validation) {
            const signature = await GenerateSignature({
                _id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
            });
            return res.json(signature);
        }
    }
    return res.json({ message: "Login credential is not valid" });
};

//  Create a new vendor
export const CreateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, pincode, foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body;

    const existingVandor = await FindVendor("", email);
    if (existingVandor !== null) {
        return res.json({ message: "A vandor is exist with this email ID" });
    }

    //generate a salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    // encrypt the password using the salt
    const createdVandor = await Vendor.create({
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
    return res.json(createdVandor);
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

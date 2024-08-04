import { Request, Response, NextFunction } from "express";
import { CreateAdminInput, CreateVendorInput } from "../dto";
import { DeliveryUser, Vendor } from "../models";
import { Transaction } from "../models/Transaction";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";
import { Admin } from "../models/Admin";
import { AdminLoginInput } from "../dto/Admin.dto";
import { sendEmail } from "../config";


//  Create a new vendor
export const CreateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, email, password, phone } = <CreateAdminInput>req.body;

    const existingAdmin = await FindAdmin("", email);
    if (existingAdmin !== null) {
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
    await sendEmail();
    return res.json(createdAdmin);
};

// Find Vendor by email address and id
export const FindAdmin = async (id: String | undefined, email?: string) => {
    if (email) {
        return await Admin.findOne({ email: email });
    } else {
        return await Admin.findById(id);
    }
};

//  Vendor login
export const AdminLogin = async (req: Request, res: Response, next: NextFunction) => {
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
export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
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
export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find();

    if (vendors !== null) {
        return res.json(vendors);
    }

    return res.json({ message: "Vendors data not available" });
};

// Get vendor by id
export const GetVendorByID = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;
    const vendors = await FindVendor(vendorId);

    if (vendors !== null) {
        return res.json(vendors);
    }

    return res.json({ message: "Vendors data not available" });
};

export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await Transaction.find();
    if (transactions) {
        return res.status(200).json(transactions);
    }

    return res.json({ message: "Transactions data not available" });
};

export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const transaction = await Transaction.findById(id);

    if (transaction) {
        return res.status(200).json(transaction);
    }

    return res.json({ message: "Transaction data not available" });
};

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {
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

export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUsers = await DeliveryUser.find();

    if (deliveryUsers) {
        return res.status(200).json(deliveryUsers);
    }

    return res.json({ message: "Unable to get Delivery Users" });
};

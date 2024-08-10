import { Request, Response, NextFunction } from "express";
import { CreateFoodInput, CreateOfferInputs, EditVendorInput, InactivateOfferInputs, MulterFile, VendorLoginInput } from "../dto";
import { Food } from "../models";
import { Offer } from "../models/offer.model";
import { Order } from "../models/order.model";
import { GenerateSignature, ValidatePassword } from "../utility";
import { cloudinary } from "../config";
import { deleteFile } from "../utility/deleteFiles";
import { FindVendor } from "../services";

//  Vendor login
export const VendorLoginService = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorLoginInput>req.body;

    const existingUser = await FindVendor("", email);

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

// Get vendor profile
export const GetVendorProfileService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const existingVendor = await FindVendor(user._id);
        return res.json(existingVendor);
    }

    return res.json({ message: "vendor Information Not Found" });
};

// Update vendor profile
export const UpdateVendorProfileService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const { foodType, name, address, phone } = <EditVendorInput>req.body;

    if (user) {
        const existingVendor = await FindVendor(user._id);

        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;
            const saveResult = await existingVendor.save();

            return res.json(saveResult);
        }
    }
    return res.json({ message: "Unable to Update vendor profile " });
};

// Update vendor cover image
export const UpdateVendorCoverImageService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const vendor = await FindVendor(user._id);
        const imageUrlList: any[] = [];

        if (vendor !== null) {
            if (req.files) {
                const files = req?.files as MulterFile[];

                if (!files || files.length === 0) {
                    return res.json({ message: "No files were uploaded." });
                }

                for (let i = 0; i < files.length; i += 1) {
                    const element = req.files && req.files[i].filename;
                    const localFilePath = `${process.env.PWD}/public/uploads/vendors/${element}`;
                    const result = await cloudinary.uploader.upload(localFilePath, {
                        folder: "vendors",
                    });
                    imageUrlList.push({ url: result?.secure_url, cloudinary_id: result?.public_id });
                    // remove files from local filesystem
                    await deleteFile(localFilePath);
                }
            }
            vendor.coverImages.push(imageUrlList);
            const saveResult = await vendor.save();
            return res.json(saveResult);
        }
    }
    return res.json({ message: "Unable to Update vendor profile " });
};

// Update vendor service status
export const UpdateVendorStatusService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const { lat, lng } = req.body;

    if (user) {
        const existingVendor = await FindVendor(user._id);

        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            if (lat && lng) {
                existingVendor.lat = lat;
                existingVendor.lng = lng;
            }
            const saveResult = await existingVendor.save();

            return res.json(saveResult);
        }
    }
    return res.json({ message: "Unable to Update vendor profile " });
};

// Add food to the vendor profile
export const AddFoodService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { name, description, category, foodType, readyTime, price } = <CreateFoodInput>req.body;

    if (user) {
        const vendor = await FindVendor(user._id);
        if (vendor !== null) {
            const imageUrlList: any[] = [];
            if (req.files) {
                const files = req.files as MulterFile[];
                if (!files || files.length === 0) {
                    return res.json({ message: "No files were uploaded." });
                }

                for (let i = 0; i < files.length; i += 1) {
                    const element = req.files && req.files[i].filename;
                    const localFilePath = `${process.env.PWD}/public/uploads/foods/${element}`;
                    const result = await cloudinary.uploader.upload(localFilePath, {
                        folder: "foods",
                    });
                    imageUrlList.push({ url: result?.secure_url, cloudinary_id: result?.public_id });
                    // remove files from local filesystem
                    await deleteFile(localFilePath);
                }

                const food = await Food.create({
                    vendorId: vendor._id,
                    name: name,
                    description: description,
                    category: category,
                    price: price,
                    rating: 0,
                    readyTime: readyTime,
                    foodType: foodType,
                    images: imageUrlList,
                });

                vendor.foods.push(food);
                const result = await vendor.save();
                return res.json(result);
            }
        }
    }
    return res.json({ message: "Unable to Update vendor profile " });
};

// Get foods from the vendor profile
export const GetFoodsService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const foods = await Food.find({ vendorId: user._id });

        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ message: "Foods not found!" });
};

// Get current order from customers
export const GetCurrentOrdersService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const orders = await Order.find({ vendorId: user._id }).populate("items.food");

        if (orders != null) {
            return res.status(200).json(orders);
        }
    }

    return res.json({ message: "Orders Not found" });
};

export const GetOrderDetailsService = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    if (orderId) {
        const order = await Order.findById(orderId).populate("items.food");

        if (order != null) {
            return res.status(200).json(order);
        }
    }

    return res.json({ message: "Order Not found" });
};

export const ProcessOrderService = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const { status, remarks, time } = req.body;

    if (orderId) {
        const order = await Order.findById(orderId).populate("food");

        order.orderStatus = status;
        order.remarks = remarks;
        if (time) {
            order.readyTime = time;
        }

        const orderResult = await order.save();

        if (orderResult != null) {
            return res.status(200).json(orderResult);
        }
    }

    return res.json({ message: "Unable to process order" });
};

export const AddOfferService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const { title, description, offerType, offerAmount, postcode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = <CreateOfferInputs>req.body;

        const vendor = await FindVendor(user._id);

        if (vendor) {
            const offer = await Offer.create({
                title,
                description,
                offerType,
                offerAmount,
                postcode,
                promocode,
                promoType,
                startValidity,
                endValidity,
                bank,
                isActive,
                minValue,
                vendors: [vendor],
            });
            return res.status(200).json(offer);
        }
    }

    return res.json({ message: "Unable to add Offer!" });
};

export const GetOffersService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        let currentOffer = Array();

        const offers = await Offer.find().populate("vendors");

        if (offers) {
            offers.map((item) => {
                if (item.vendors) {
                    item.vendors.map((vendor) => {
                        if (vendor._id.toString() === user._id) {
                            currentOffer.push(item);
                        }
                    });
                }

                if (item.offerType === "GENERIC") {
                    currentOffer.push(item);
                }
            });
        }
        return res.status(200).json(currentOffer);
    }
    return res.json({ message: "Offers Not available" });
};

export const EditOfferService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const offerId = req.params.id;

    if (user) {
        const { title, description, offerType, offerAmount, postcode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = <CreateOfferInputs>req.body;

        const currentOffer = await Offer.findById(offerId);

        if (currentOffer) {
            const vendor = await FindVendor(user._id);

            if (vendor) {
                (currentOffer.title = title),
                    (currentOffer.description = description),
                    (currentOffer.offerType = offerType),
                    (currentOffer.offerAmount = offerAmount),
                    (currentOffer.postcode = postcode),
                    (currentOffer.promoType = promoType),
                    (currentOffer.startValidity = startValidity),
                    (currentOffer.endValidity = endValidity),
                    (currentOffer.bank = bank),
                    (currentOffer.bins = bins),
                    (currentOffer.isActive = isActive),
                    (currentOffer.minValue = minValue);

                const result = await currentOffer.save();

                return res.status(200).json(result);
            }
        }
    }

    return res.json({ message: "Unable to add Offer!" });
};

export const DeleteOfferService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const offerId = req.params.id;

    if (user) {
        const { isActive } = <InactivateOfferInputs>req.body;

        const currentOffer = await Offer.findById(offerId);

        if (currentOffer) {
            const vendor = await FindVendor(user._id);

            if (vendor) {
                currentOffer.isActive = !currentOffer.isActive;
                const result = await currentOffer.save();

                return res.status(200).json(result);
            }
        }
    }

    return res.json({ message: "Offer deactivated!" });
};

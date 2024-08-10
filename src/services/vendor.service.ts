import { Request, Response, NextFunction } from "express";
import { CreateFoodInput, CreateOfferInputs, EditVendorInput, InactivateOfferInputs, MulterFile, VendorLoginInput } from "../dto";
import { Food } from "../models";
import { Offer } from "../models/offer.model";
import { Order } from "../models/order.model";
import { GenerateResponseData, GenerateSignature, GenerateValidationErrorResponse, validateInput, ValidatePassword } from "../utility";
import { cloudinary } from "../config";
import { deleteFile } from "../utility/deleteFiles";
import { FindVendor } from "../services";
import createHttpError, { InternalServerError } from "http-errors";

/** VendorLoginService
 *
 * @param req
 * @param res @param next @returns
 */
export const VendorLoginService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <VendorLoginInput>req.body;
    const errors = await validateInput(VendorLoginInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, password } = inputs;

    try {
        const existingUser = await FindVendor("", email);

        if (existingUser !== null) {
            const validation = await ValidatePassword(password, existingUser.password, existingUser.salt);
            if (validation) {
                const signature = await GenerateSignature({
                    _id: existingUser._id,
                    email: existingUser.email,
                    name: existingUser.name,
                });
                const response = GenerateResponseData(signature, "Authenticated successfully.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Login credential is not valid"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** GetVendorProfileService
 *
 * @param req
 * @param res @param next @returns
 */
export const GetVendorProfileService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        if (user) {
            const existingVendor = await FindVendor(user._id);
            const response = GenerateResponseData(existingVendor, "Profile data found.", 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(401, "vendor Information Not Found"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** UpdateVendorProfileService
 * @param req @param res @param next @returns
 */
export const UpdateVendorProfileService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <EditVendorInput>req.body;
    const errors = await validateInput(EditVendorInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { foodType, name, address, phone } = inputs;
    const user = req.user;

    try {
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
        return next(createHttpError(401, "Unable to Update vendor profile"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** UpdateVendorCoverImageService
 *
 * @param req
 * @param res @param next @returns
 */
export const UpdateVendorCoverImageService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
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
                const response = GenerateResponseData(saveResult, "Profile updated successfully.", 201);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Unable to Update vendor profile"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/**  UpdateVendorStatusService TODO: input validation
 *
 * @param res @param next @returns
 */
export const UpdateVendorStatusService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const { lat, lng } = req.body;

    try {
        if (user) {
            const existingVendor = await FindVendor(user._id);

            if (existingVendor !== null) {
                existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
                if (lat && lng) {
                    existingVendor.lat = lat;
                    existingVendor.lng = lng;
                }
                const saveResult = await existingVendor.save();

                const response = GenerateResponseData(saveResult, "Profile data saved.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Unable to Update vendor profile"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** AddFoodService
 *
 * @param req
 * @param res @param next @returns
 */
export const AddFoodService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <CreateFoodInput>req.body;
    const errors = await validateInput(CreateFoodInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { name, description, category, foodType, readyTime, price } = inputs;
    const user = req.user;

    try {
        if (user) {
            const vendor = await FindVendor(user._id);
            if (vendor !== null) {
                const imageUrlList: any[] = [];
                if (req.files) {
                    const files = req.files as MulterFile[];
                    if (!files || files.length === 0) {
                        return next(createHttpError(401, "No files were uploaded."));
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

                    const response = GenerateResponseData(result, "Profile data found.", 200);
                    return res.status(200).json(response);
                }
            }
        }
        return next(createHttpError(401, "Unable to Update vendor profile"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** GetFoodsService
 * @param req @param res @param next @returns
 */
export const GetFoodsService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    try {
        if (user) {
            const foods = await Food.find({ vendorId: user._id });

            if (foods !== null) {
                const response = GenerateResponseData(foods, "data found.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(404, "Data not found"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** GetCurrentOrdersService
 *
 * @param req
 * @param res @param next @returns
 */
export const GetCurrentOrdersService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    try {
        if (user) {
            const orders = await Order.find({ vendorId: user._id }).populate("items.food");

            if (orders) {
                const response = GenerateResponseData(orders, "data found.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(404, "Data not found."));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** GetOrderDetailsService
 * @param req @param res @param next @returns
 */
export const GetOrderDetailsService = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    try {
        if (orderId) {
            const order = await Order.findById(orderId).populate("items.food");

            if (order) {
                const response = GenerateResponseData(order, "Data found.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(404, "Data not found"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** ProcessOrderService
 * @param req @param res @param next @returns
 */
export const ProcessOrderService = async (req: Request, res: Response, next: NextFunction) => {
    const { status, remarks, time } = req.body;
    const orderId = req.params.id;

    try {
        if (orderId) {
            const order = await Order.findById(orderId).populate("food");

            order.orderStatus = status;
            order.remarks = remarks;
            if (time) {
                order.readyTime = time;
            }

            const orderResult = await order.save();

            if (orderResult) {
                const response = GenerateResponseData(orderResult, "order processed.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(404, "Unable to process order"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** AddOfferService
 * @param req @param res @param next @returns
 */
export const AddOfferService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <CreateOfferInputs>req.body;
    const errors = await validateInput(CreateOfferInputs, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { title, description, offerType, offerAmount, postcode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = inputs;
    const user = req.user;

    try {
        if (user) {
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
                const response = GenerateResponseData(offer, "Offer added.", 201);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(404, "Unable to add Offer!"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** GetOffersService
 * @param req @param res @param next @returns
 */
export const GetOffersService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    try {
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
            const response = GenerateResponseData(currentOffer, "Offer found.", 200);
            return res.status(200).json(response);
        }
        return next(createHttpError(404, "Offers Not available"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** EditOfferService
 * @param req @param res @param next @returns
 */
export const EditOfferService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <CreateOfferInputs>req.body;
    const errors = await validateInput(CreateOfferInputs, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { title, description, offerType, offerAmount, postcode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = inputs;
    const user = req.user;
    const offerId = req.params.id;

    try {
        if (user) {
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

                    const response = GenerateResponseData(result, "Offer added.", 200);
                    return res.status(200).json(response);
                }
            }
        }

        return next(createHttpError(400, "Unable to add Offer!"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

/** DeleteOfferService
 * @param req @param res @param next @returns
 */
export const DeleteOfferService = async (req: Request, res: Response, next: NextFunction) => {
    // const inputs = <InactivateOfferInputs>req.body; const errors = await validateInput(InactivateOfferInputs, inputs); if (errors.length > 0) return
    // res.status(400).json(GenerateValidationErrorResponse(errors));

    const user = req.user;
    const offerId = req.params.id;
    // const { isActive } = inputs;

    try {
        if (user) {
            const currentOffer = await Offer.findById(offerId);

            if (currentOffer) {
                const vendor = await FindVendor(user._id);

                if (vendor) {
                    currentOffer.isActive = !currentOffer.isActive;
                    const result = await currentOffer.save();

                    const response = GenerateResponseData(result, "offer inactivated.", 200);
                    return res.status(200).json(response);
                }
            }
        }
        return next(createHttpError(404, "Error while offer update"));
    } catch (error) {
        return next(InternalServerError(error.message));
    }
};

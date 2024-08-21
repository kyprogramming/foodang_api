import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import { CartItem, CreateCustomerInput, CreatePaymentInput, EditCustomerProfileInput, OrderInputs, OtpRequestInput, RequestUserInput, UserLoginInput } from "../dto";
import { Customer, DeliveryUser, Food, Vendor } from "../models";
import { Offer } from "../models/offer.model";
import { Order } from "../models/order.model";
import { Transaction } from "../models";
import {
    GenerateOtp,
    GeneratePassword,
    GenerateResponseData,
    GenerateSalt,
    GenerateToken,
    GenerateValidationErrorResponse,
    isValidMongooseObjectId,
    SendOTP,
    validateInput,
    ValidatePassword,
} from "../utility";
import createHttpError, { InternalServerError } from "http-errors";
import { errorMsg, successMsg } from "../constants/customer.constant";

/** Customer signup
 * @param req @param res @param next @returns
 */
export const CustomerSignUpService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <CreateCustomerInput>req.body;
    const errors = await validateInput(CreateCustomerInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, phone, password } = inputs;

    try {
        const customer = await Customer.find({ email: email });

        if (!customer) {
            return next(createHttpError(409, errorMsg.customer_already_exist));
        }

        const salt = await GenerateSalt();
        const userPassword = await GeneratePassword(password, salt);
        const { otp, expiry } = GenerateOtp();

        const result = await Customer.create({
            email: email,
            password: userPassword,
            salt: salt,
            phone: phone,
            otp: otp,
            otp_expiry: expiry,
            firstName: "",
            lastName: "",
            address: "",
            verified: false,
            lat: 0,
            lng: 0,
            orders: [],
        });

        if (result) {
            await SendOTP(otp, phone);

            const signature = await GenerateToken({
                _id: result._id,
                email: result.email,
                verified: result.verified,
            });
            const response = GenerateResponseData(signature, successMsg.customer_create_success, 200);
            return res.status(200).json(response);
        }

        return res.status(400).json({ msg: "Error while creating user" });
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Customer login
 * @param req @param res @param next @returns
 */
export const CustomerLoginService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <UserLoginInput>req.body;
    const errors = await validateInput(UserLoginInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { email, password } = inputs;
    try {
        const customer = await Customer.findOne({ email: email });
        if (customer) {
            const validation = await ValidatePassword(password, customer.password, customer.salt);

            if (validation) {
                const signature = await GenerateToken({
                    _id: customer._id,
                    email: customer.email,
                    verified: customer.verified,
                });

                const response = GenerateResponseData(signature, successMsg.customer_auth_success, 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, errorMsg.customer_auth_error));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Customer OTP verify
 * @param req @param res @param next @returns
 */
export const CustomerOTPVerifyService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <OtpRequestInput>req.body;
    const errors = await validateInput(OtpRequestInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { otp } = req.body;
    const customer = req.user;

    try {
        if (customer) {
            const profile = await Customer.findById(customer._id);
            if (profile) {
                if (profile.verified) return next(createHttpError(401, errorMsg.customer_already_verified));

                if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                    profile.verified = true;

                    const verifiedCustomer = await profile.save();

                    const signature = await GenerateToken({
                        _id: verifiedCustomer._id,
                        email: verifiedCustomer.email,
                        verified: verifiedCustomer.verified,
                    });

                    const response = GenerateResponseData(signature, successMsg.customer_verify_success, 200);
                    return res.status(200).json(response);
                }
            }
        }
        return next(createHttpError(404, errorMsg.customer_verify_error));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Customer OTP request
 * @param req @param res @param next @returns
 */
export const RequestOtpService = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    try {
        if (customer) {
            const profile = await Customer.findById(customer._id);

            if (profile) {
                if (profile?.verified) return next(createHttpError(401, errorMsg.customer_already_verified));

                const { otp, expiry } = GenerateOtp();
                profile.otp = otp;
                profile.otp_expiry = expiry;

                await profile.save();
                const sendCode = await SendOTP(otp, profile.phone);

                if (!sendCode) return next(createHttpError(401, "Failed to verify your phone number"));

                const response = GenerateResponseData(null, "OTP sent to your registered Mobile Number!", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Error with Requesting OTP"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Get Customer profile
export const GetCustomerProfileService = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    try {
        if (customer) {
            const profile = await Customer.findById(customer._id);

            if (profile) {
                const response = GenerateResponseData(profile, "Profile data found.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Error while fetching profile data."));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

// Edit Customer profile
export const EditCustomerProfileService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <EditCustomerProfileInput>req.body;
    const errors = await validateInput(EditCustomerProfileInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { firstName, lastName, address, lat, lng } = inputs;
    const customer = req.user;

    try {
        if (customer) {
            const profile = await Customer.findById(customer._id);

            if (profile) {
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                profile.lat = lat;
                profile.lng = lng;
                const result = await profile.save();

                const response = GenerateResponseData(result, "Profile data found.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Error while Updating profile data."));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Add to cart
 * @param req @param res @param next @returns
 */
export const AddToCartService = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    try {
        if (customer) {
            const profile = await Customer.findById(customer._id);
            let cartItems = Array();

            const { _id, unit } = <CartItem>req.body;

            const food = await Food.findById(_id);

            if (food) {
                if (profile) {
                    cartItems = profile.cart;

                    if (cartItems.length > 0) {
                        // check and update
                        let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id);
                        if (existFoodItems.length > 0) {
                            const index = cartItems.indexOf(existFoodItems[0]);

                            if (unit > 0) {
                                cartItems[index] = { food, unit };
                            } else {
                                cartItems.splice(index, 1);
                            }
                        } else {
                            cartItems.push({ food, unit });
                        }
                    } else {
                        // add new Item
                        cartItems.push({ food, unit });
                    }

                    if (cartItems) {
                        profile.cart = cartItems as any;
                        const cartResult = await profile.save();

                        const response = GenerateResponseData(cartResult.cart, "Added to the cart.", 200);
                        return res.status(200).json(response);
                    }
                }
            }
        }

        return next(createHttpError(401, "Unable to add to cart!"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Get customer cart items
 * @param req @param res @param next @returns
 */
export const GetCartService = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    try {
        if (customer) {
            const profile = await Customer.findById(customer._id);

            if (profile) {
                const response = GenerateResponseData(profile.cart, "Cart data found.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Cart is Empty!"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Delete customer cart
 * @param req @param res @param next @returns
 */
export const DeleteCartService = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    try {
        if (customer) {
            const profile = await Customer.findById(customer._id).populate("cart.food").exec();

            if (profile != null) {
                profile.cart = [] as any;
                const cartResult = await profile.save();

                const response = GenerateResponseData(cartResult, "Cart is cleared.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Cart is already empty"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/**  Verify offer validity
 * @param req @param res @param next @returns
 */
export const VerifyOfferService = async (req: Request, res: Response, next: NextFunction) => {
    const offerId = req.params.id;
    if (!isValidMongooseObjectId(offerId)) return next(createHttpError(422, `Invalid request parameter`));

    const customer = req.user;

    try {
        if (customer) {
            const appliedOffer = await Offer.findById(offerId);

            if (appliedOffer) {
                if (appliedOffer.isActive) {
                    const response = GenerateResponseData(appliedOffer, "Offer is Valid.", 200);
                    return res.status(200).json(response);
                }
            }
        }
        return next(createHttpError(401, "Offer is not valid"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Create payment
 * @param req @param res @param next @returns
 */
export const CreatePaymentService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <CreatePaymentInput>req.body;
    const errors = await validateInput(CreatePaymentInput, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { amount, paymentMode, offerId } = inputs;
    const customer = req.user;

    try {
        let payableAmount = Number(amount);
        if (offerId) {
            const appliedOffer = await Offer.findById(offerId);

            if (appliedOffer?.isActive) {
                payableAmount = payableAmount - appliedOffer.offerAmount;
            }
        }
        // TODO: here perform payment gateway charge api right after payment gateway successful/failure status

        //  create record on transaction
        const transaction = await Transaction.create({
            customer: customer?._id,
            vendorId: "",
            orderId: "",
            orderValue: payableAmount,
            offerUsed: offerId || "NA",
            status: "OPEN",
            paymentMode: paymentMode,
            paymentResponse: "Payment is cash on Delivery",
        });

        //return transaction
        const response = GenerateResponseData(transaction, "Payment successful.", 200);
        return res.status(200).json(response);
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Create customer order
 * @param req @param res @param next @returns
 */
export const CreateOrderService = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = <OrderInputs>req.body;
    const errors = await validateInput(OrderInputs, inputs);
    if (errors.length > 0) return res.status(400).json(GenerateValidationErrorResponse(errors));

    const { txnId, amount } = inputs;
    const customer = req.user;

    try {
        if (customer) {
            const { status, currentTransaction } = await validateTransaction(txnId);

            if (!status) {
                return next(createHttpError(401, "Error while Creating Order!"));
            }

            const profile: any = await Customer.findById(customer._id);
            const items: any = profile?.cart;

            const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

            let netAmount = 0.0;
            let vendorId: any;

            const foods = await Food.find()
                .where("_id")
                .in(items.map((item: any) => item.food))
                .exec();

            const foodItems = foods.map((food) => {
                items?.map((item: any) => {
                    console.log(typeof food._id);
                    console.log(typeof item.food);

                    if (food._id.toString() === item.food.toString()) {
                        vendorId = food.vendorId;
                        netAmount += food.price * item.unit;
                    }
                });
            });

            if (items) {
                const currentOrder = await Order.create({
                    orderId: orderId,
                    vendorId: vendorId,
                    items: items,
                    totalAmount: netAmount,
                    paidAmount: amount,
                    orderDate: new Date(),
                    orderStatus: "Waiting",
                    remarks: "",
                    deliveryId: "",
                    readyTime: 45,
                });

                if (currentOrder) {
                    profile.cart = [] as any;
                    profile.orders.push(currentOrder);
                    if (currentTransaction) {
                        currentTransaction.vendorId = vendorId;
                        currentTransaction.orderId = orderId;
                        currentTransaction.status = "CONFIRMED";

                        await currentTransaction?.save();
                    }

                    await assignOrderForDelivery(currentOrder._id, vendorId);

                    const profileResponse = await profile?.save();

                    const response = GenerateResponseData(profileResponse, "Order created successfully.", 200);
                    return res.status(200).json(response);
                }
            }
        }
        return next(createHttpError(401, "Error while Creating Order"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/**  Get customer orders
 * @param req @param res @param next @returns
 */
export const GetOrdersService = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    try {
        if (customer) {
            const profile = await Customer.findById(customer._id).populate("orders");
            if (profile) {
                const response = GenerateResponseData(profile.orders, "Order found.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Orders not found"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** Get order by id
 * @param req @param res @param next @returns
 */
export const GetOrderByIdService = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    if (!isValidMongooseObjectId(orderId)) return next(createHttpError(422, `Invalid request parameter`));

    const customer = req.user;
    try {
        if (orderId) {
            const profile = await Customer.findById(customer?._id).populate("orders");
            const order = profile?.orders.find((order) => order._id.equals(orderId));
            if (order) {
                const response = GenerateResponseData(order, "Order found.", 200);
                return res.status(200).json(response);
            }
        }
        return next(createHttpError(401, "Order not found"));
    } catch (error: any) {
        return next(InternalServerError(error.message));
    }
};

/** validate transaction
 * @param txnId @returns
 */
const validateTransaction = async (txnId: string) => {
    const currentTransaction = await Transaction.findById(txnId);
    if (currentTransaction) {
        if (currentTransaction.status.toLowerCase() !== "failed") {
            return { status: true, currentTransaction };
        }
    }
    return { status: false, currentTransaction };
};

//  Delivery Notification

// TODO: pending error handling
const assignOrderForDelivery = async (orderId: string, vendorId: string) => {
    // find the vendor
    const vendor = await Vendor.findById(vendorId);
    if (vendor) {
        const areaCode = vendor.postcode;
        const vendorLat = vendor.lat;
        const vendorLng = vendor.lng;

        //find the available Delivery person
        const deliveryPerson = await DeliveryUser.find({ postcode: areaCode, verified: true, isAvailable: true });
        if (deliveryPerson && deliveryPerson?.length > 0) {
            // Check the nearest delivery person and assign the order

            const currentOrder = await Order.findById(orderId);
            if (currentOrder) {
                //update Delivery ID
                currentOrder.deliveryId = deliveryPerson[0]._id;
                await currentOrder.save();

                //Notify to vendor for received new order firebase push notification
            }
        }
    }

    // Update Delivery ID
};

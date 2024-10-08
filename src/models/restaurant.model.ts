import { ResetPassword } from './../controllers/user.controller';
import mongoose, { Schema } from "mongoose";
import { IFood, IRestaurant } from "../interfaces";


// const AddressSchema = new Schema({
//     street: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     location: {
//         type: { type: String, default: "Point", enum: ["Point"] },
//         coordinates: { type: [Number], required: true }, // [longitude, latitude]
//     },
// });


const AddressSchema = new Schema(
    {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postal_code: { type: String, required: true },
        country: { type: String, required: true },
        coordinates: { type: {lat:Number, lng:Number}},
    },
    { _id: false }
);



const ContactDetailsSchema = new Schema({
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
});

const OpeningHoursSchema = new Schema({
    mon: { open: { type: String, required: true }, close: { type: String, required: true } },
    tue: { open: { type: String, required: true }, close: { type: String, required: true } },
    // Define for each day similarly
});

const OwnerSchema = new Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
});


const RestaurantSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        vendorId: { type: Schema.Types.ObjectId, ref: "vendor", require: true },
        address: { type: AddressSchema, required: true },
        averageDeliveryTime: { type: Number, required: true },
        minOrder: { type: Number, default: 0 },
        saleTax: { type: Number, default: 0 },
        shopCategory: { type: String, required: true },
        cuisine: { type: [String], required: true },
        imageUrl: { type: String, required: true },
        logoUrl: { type: String, required: true },
        active: { type: Boolean, default: true },
        // paymentMethods: { type: [String], required: true },
        // rating: { type: Number, default: 0 },
        // numberOfReviews: { type: Number, default: 0 },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            },
        },
        timestamps: true,
    }
);

const Restaurant = mongoose.model<IRestaurant>("restaurant", RestaurantSchema);

export { Restaurant };

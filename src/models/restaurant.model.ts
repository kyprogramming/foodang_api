import mongoose, { Schema } from "mongoose";
import { IFood, IRestaurant } from "../interfaces";

const RestaurantSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerName: { type: String, required: true },
        foodType: { type: [String] },
        postcode: { type: String, required: true },
        address: { type: String },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        salt: { type: String, required: true },
        serviceAvailable: { type: Boolean },
        coverImages: { type: Array },
        rating: { type: Number },
        foods: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "food",
            },
        ],
        lat: { type: Number },
        lng: { type: Number },
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

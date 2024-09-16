import mongoose, { Schema } from "mongoose";
import { IFood, IRestaurant } from "../interfaces";


const AddressSchema = new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    location: {
        type: { type: String, default: "Point", enum: ["Point"] },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
});

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
        name: { type: String, required: true },
        description: { type: String },
        address: { type: AddressSchema, required: true },
        contactDetails: { type: ContactDetailsSchema, required: true },
        openingHours: { type: OpeningHoursSchema, required: true },
        cuisine: { type: [String], required: true },
        rating: { type: Number, default: 0 },
        numberOfReviews: { type: Number, default: 0 },
        averageDeliveryTime: { type: Number, required: true },
        priceRange: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        menu: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }], // Referencing the MenuItem schema
        images: [{ url: { type: String }, altText: { type: String } }],
        owner: { type: OwnerSchema, required: true },
        paymentMethods: { type: [String], required: true },
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

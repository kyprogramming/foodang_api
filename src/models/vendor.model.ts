import mongoose, { Document, Schema, model } from "mongoose";
import IVendor from "../interfaces/IVendor";

// Define the Address schema
const addressSchema = new Schema(
    {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postal_code: { type: String, required: true },
        country: { type: String, required: true },
    },
    { _id: false }
);

// Define the PrimaryContactPerson schema
const primaryContactPersonSchema = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        position: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
    },
    { _id: false }
);

// Define the Vendor schema
const vendorSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        website: { type: String },
        active: { type: Boolean, default: true },
        address: { type: addressSchema, required: true },
        primary_contact_person: { type: primaryContactPersonSchema, required: true },
        restaurant_ids: { type: [{ type: Schema.Types.ObjectId, ref: "restaurant" }], default: undefined },
    },
    {
        timestamps: true,
    }
);

// Define the Vendor model
const Vendor = model<IVendor>("vendor", vendorSchema);

// Export the model and interface
export default Vendor;

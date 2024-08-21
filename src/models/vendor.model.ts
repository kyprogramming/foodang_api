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

// Define the ContactInfo schema
const contactInfoSchema = new Schema(
    {
        address: { type: addressSchema, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        website: { type: String, required: true },
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
        vendor_name: { type: String, required: true },
        contact_info: { type: contactInfoSchema, required: true },
        primary_contact_person: { type: primaryContactPersonSchema, required: true },
        restaurant_ids: [{ type: Schema.Types.ObjectId, ref: "restaurant" }],
    },
    {
        timestamps: true,
    }
);

// Define the Vendor model
const Vendor = model<IVendor>("vendor", vendorSchema);

// Export the model and interface
export default Vendor;

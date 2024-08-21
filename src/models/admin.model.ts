import mongoose, { Schema, Document } from "mongoose";
import { IAdmin } from "../interfaces";

const AdminSchema = new Schema(
    {
        name: { type: String },
        address: { type: String },
        phone: { type: String },
        email: { type: String, required: true },
        password: { type: String, required: true },
        googleId: { type: String },
        facebookId: { type: String },
        salt: { type: String, required: true },
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

const Admin = mongoose.model<IAdmin>("admin", AdminSchema);

export { Admin };

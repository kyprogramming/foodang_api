import mongoose, { Schema, Document } from "mongoose";


export interface IAdmin extends Document {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
}

const AdminSchema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
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

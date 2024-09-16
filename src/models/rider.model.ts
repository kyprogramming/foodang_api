import { Schema, model } from "mongoose";
import { IRider } from "../interfaces";


const PointSchema = new Schema({
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
});

const RiderSchema = new Schema<IRider>({
    personalDetails: {
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: true },
        salt: { type: String },
        phone: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        profileImage: { type: String },
    },
    vehicleDetails: {
        vehicleType: { type: String, required: true },
        vehicleNumber: { type: String, required: true },
        licenseNumber: { type: String, required: true },
        insuranceDetails: {
            insuranceNumber: { type: String, required: true },
            expiryDate: { type: Date, required: true },
        },
    },
    accountDetails: {
        status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
        joinedDate: { type: Date, default: Date.now },
        currentBalance: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        numberOfDeliveries: { type: Number, default: 0 },
    },
    availability: {
        isAvailable: { type: Boolean, default: true },
        workingHours: {
            start: { type: String, required: true }, // e.g., "09:00"
            end: { type: String, required: true }, // e.g., "21:00"
        },
    },
    location: {
        currentLocation: { type: PointSchema, required: true },
        lastLocationUpdate: { type: Date, default: Date.now },
    },
    performanceMetrics: {
        totalDeliveries: { type: Number, default: 0 },
        onTimeDeliveries: { type: Number, default: 0 },
        lateDeliveries: { type: Number, default: 0 },
        totalDistanceCovered: { type: Number, default: 0 }, // in km
        averageDeliveryTime: { type: Number, default: 0 }, // in minutes
    },
    assignedOrders: [
        {
            orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
            assignedTime: { type: Date, required: true },
            status: { type: String, enum: ["in-progress", "completed", "canceled"], required: true },
        },
    ],
    documents: {
        driverLicense: { type: String },
        vehicleRegistration: { type: String },
        insurance: { type: String },
    },
    emergencyContact: {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true },
    },
    active: { type: Boolean, default: true },
    refreshToken: { type: String, unique: true, sparse: true, default: undefined },
});

// Index for geo-spatial queries
RiderSchema.index({ "location.currentLocation": "2dsphere" });

const Rider = model<IRider>("Rider", RiderSchema);

export default Rider;

import { Document, ObjectId } from "mongoose";

// GeoJSON Point type for location
interface Point {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
}

// Rider Interface
export interface IRider extends Document {
    personalDetails: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        salt: string;
        phone: string;
        dateOfBirth: Date;
        profileImage?: string;
    };
    vehicleDetails: {
        vehicleType: string;
        vehicleNumber: string;
        licenseNumber: string;
        insuranceDetails: {
            insuranceNumber: string;
            expiryDate: Date;
        };
    };
    accountDetails: {
        status: "active" | "inactive" | "suspended";
        joinedDate: Date;
        currentBalance: number;
        rating: number;
        numberOfDeliveries: number;
    };
    availability: {
        isAvailable: boolean;
        workingHours: {
            start: string; // "09:00"
            end: string; // "21:00"
        };
    };
    location: {
        currentLocation: Point;
        lastLocationUpdate: Date;
    };
    performanceMetrics: {
        totalDeliveries: number;
        onTimeDeliveries: number;
        lateDeliveries: number;
        totalDistanceCovered: number;
        averageDeliveryTime: number; // in minutes
    };
    assignedOrders: {
        orderId: ObjectId;
        assignedTime: Date;
        status: "in-progress" | "completed" | "canceled";
    }[];
    documents: {
        driverLicense?: string;
        vehicleRegistration?: string;
        insurance?: string;
    };
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    active: boolean;
    refreshToken: string;
}

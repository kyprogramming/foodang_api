import { Types } from "mongoose";

export interface IOrder extends Document {
    _id: Types.ObjectId;
    orderId: string;
    restaurantId: string;
    items: [any];
    totalAmount: number;
    paidAmount: number;
    orderDate: Date;
    orderStatus: string;
    remarks: string;
    deliveryId: string;
    readyTime: number;
}

export default IOrder;

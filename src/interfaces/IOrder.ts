export interface IOrder extends Document {
    orderId: string;
    vendorId: string;
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

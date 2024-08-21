export interface ITransaction extends Document {
    customer: string;
    restaurantId: string;
    orderId: string;
    orderValue: number;
    offerUsed: string;
    status: string;
    paymentMode: string;
    paymentResponse: string;
}

export default ITransaction;

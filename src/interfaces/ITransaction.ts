export interface ITransaction extends Document {
    customer: string;
    vendorId: string;
    orderId: string;
    orderValue: number;
    offerUsed: string;
    status: string;
    paymentMode: string;
    paymentResponse: string;
}

export default ITransaction;

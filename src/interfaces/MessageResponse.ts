export interface ResponseT<T = null> {
    status: string;
    data?: T;
    errors?: any;
    message: string;
    statusCode: number;
}

export default ResponseT;

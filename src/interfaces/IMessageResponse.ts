export interface IResponseT<T = null> {
    success: boolean;
    data?: T;
    error?: any;
    message: string;
    statusCode: number;
}

export default IResponseT;

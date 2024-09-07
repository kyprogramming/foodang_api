export interface IResponseT<T = null> {
    success: boolean;
    data?: T;
    statusCode: number;
    message: string;
    error?: any;
}

export default IResponseT;

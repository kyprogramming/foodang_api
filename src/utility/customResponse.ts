import { IResponseT } from "../interfaces";

export const customResponse = <T>({ success, data, error, message, statusCode }: IResponseT<T>) => {
    return {
        success,
        data,
        error,
        message,
        statusCode,
    };
};

export default customResponse;

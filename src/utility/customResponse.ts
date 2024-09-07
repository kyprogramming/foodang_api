import { IResponseT } from "../interfaces";

export const customResponse = <T>({ success, data, statusCode, message, error }: IResponseT<T>) => {
    return {
        success,
        data,
        statusCode,
        message,
        error,
    };
};

export default customResponse;

import { ResponseT } from "../interfaces";

export const customResponse = <T>({ status, data, errors, message, statusCode }: ResponseT<T>) => {
    return {
        status,
        data,
        errors,
        message,
        statusCode,
    };
};

export default customResponse;

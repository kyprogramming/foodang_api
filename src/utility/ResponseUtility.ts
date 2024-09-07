import customResponse from "./customResponse";

type SuccessResponse<T> = {
    success: boolean;
    data: T;
    statusCode: number;
    message?: string;
    detailMsg?: string;
    request?: {
        type?: string;
        description?: string;
        url?: string;
    };
};

export const GenerateSuccessResponse = <T>(
    data: T | string,
    statusCode: number,
    message?: string,
    detailMsg?: string,
    type?: string,
    desc?: string,
    uri?: string
): SuccessResponse<T | string | any[]> => {
    let responseData: T | string | any[];

    // Determine if `data` is string or an object
    if (typeof data === "string") {
        responseData = data; // If string, set directly as the response message
    } else if (typeof data === "object") {
        if (Array.isArray(data)) {
            responseData = [...data]; // If array, spread into a new array
        } else if (data !== null) {
            responseData = { ...data }; // If it's an object, copy the object
        } else {
            responseData = "Unexpected data type"; // Handle potential null case
        }
    }
    // Construct the full response
    return {
        success: true,
        data: responseData,
        statusCode,
        message,
        detailMsg,
        // request: type || desc || uri ? { type, description: desc, url: uri ? `https://your-api-url/${uri}` : undefined } : undefined,
    };
};

export const GenerateValidationErrorResponse = (errors) => {
    return customResponse({
        success: false,
        error: errors.map((err) => ({ title: err.property, detail: err.constraints })),
        message: `Input validation error`,
        statusCode: 400,
    });
};

import customResponse from "./customResponse";

export const GenerateResponseData = (data, code, msg?, type?, desc?, uri?) => {
    let response: any = {};

    if (typeof data === "string") {
        response.message = data;
    } else if (typeof data === "object") {
        if (Array.isArray(data)) {
            if (data.every((item) => typeof item === "object" && item !== null)) {
                response = data;
            } else {
                response = [...data];
            }
        } else if (data !== null) {
            response = data;
        }
    } else {
        response.message = "Unexpected data type";
        response.error = "Data type not supported";
    }

    // TODO: needs to be added in future

    // response.request = { type: type, description: desc, url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${uri}` };

    return customResponse<typeof data>({
        success: true,
        data: response,
        message: msg,
        statusCode: code,
    });

    // return response;
};

export const GenerateValidationErrorResponse = (errors) => {
    return customResponse({
        success: false,
        error: errors.map((err) => ({ title: err.property, detail: err.constraints })),
        message: `Input validation error`,
        statusCode: 400,
    });
};

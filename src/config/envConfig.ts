import dotenv from "dotenv-safe";
import process from "process";

dotenv.config();

export const envConfig = {
    PORT: process?.env?.PORT || 8000,
    NODE_ENV: process?.env?.NODE_ENV || "development",
    APP_SECRET: process?.env?.APP_SECRET,

    MONGODB_CON: process?.env?.MONGODB_CON || "",
    TEST_ENV_MONGODB_CON: process?.env?.TEST_ENV_MONGODB_CON,

    TWILIO_ACCOUNT_SID: process?.env?.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process?.env?.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process?.env?.TWILIO_PHONE_NUMBER,

    CLOUDINARY_CLOUD_NAME: process?.env?.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process?.env?.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process?.env?.CLOUDINARY_API_SECRET,

    // TOKEN_SECRET: process?.env?.TOKEN_SECRET, JWT_EXPIRE_TIME: process?.env?.JWT_EXPIRE_TIME,

    // WEBSITE_URL: process?.env?.WEBSITE_URL, API_URL: process?.env?.API_URL, API_VERSION: process?.env?.API_VERSION,

    // SEND_GRID_API_KEY: process?.env?.SEND_GRID_API_KEY, ADMIN_SEND_GRID_EMAIL: process?.env?.ADMIN_SEND_GRID_EMAIL, CLIENT_URL: process?.env?.CLIENT_URL,

    // ACCESS_TOKEN_SECRET_KEY: process?.env?.ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY: process?.env?.REFRESH_TOKEN_SECRET_KEY, ACCESS_TOKEN_KEY_EXPIRE_TIME:
    // process?.env?.ACCESS_TOKEN_KEY_EXPIRE_TIME, REFRESH_TOKEN_KEY_EXPIRE_TIME: process?.env?.REFRESH_TOKEN_KEY_EXPIRE_TIME, JWT_ISSUER: process?.env?.JWT_ISSUER, REST_PASSWORD_LINK_EXPIRE_TIME:
    // process?.env?.REST_PASSWORD_LINK_EXPIRE_TIME,
};

export default envConfig;

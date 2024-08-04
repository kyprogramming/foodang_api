export const PORT = process.env.PORT || 8000;

// # TWILIO
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "AC0eca9424ab105caa80f92f13ed8dee7f";
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "9fc30414d1da823300ca2119d9ba709a";
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "+14845454328";

// CLOUDINARY_CLOUD_NAME = dfdjs3umq CLOUDINARY_API_KEY = 732717696381318 CLOUDINARY_API_SECRET = qFzcZhycge9E7liN - Xrkawmf8Tw CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dfdjs3umq

// kkyprogramming@gmail.com - CLOUDINARY Cloud name - diofnvgn1 API Key - 596747713874269 API Secret - upzWycTDKt2U_ne6UbWrn4Gp-EI
// CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@diofnvgn1

import dotenv from "dotenv-safe";

dotenv.config();

export const environmentConfig = {
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
    TEST_ENV_MONGODB_CONNECTION_STRING: process.env.TEST_ENV_MONGODB_CONNECTION_STRING || "",

    MONGO_URI: "mongodb://localhost:27017/food_order_v1",
    APP_SECRET: "4234DFDEEertrt",

    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 8000,

    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "AC0eca9424ab105caa80f92f13ed8dee7f",
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "9fc30414d1da823300ca2119d9ba709a",
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || "+14845454328",

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    // TOKEN_SECRET: process.env.TOKEN_SECRET, JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,

    // WEBSITE_URL: process.env.WEBSITE_URL, API_URL: process.env.API_URL, API_VERSION: process.env.API_VERSION,

    // SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY, ADMIN_SEND_GRID_EMAIL: process.env.ADMIN_SEND_GRID_EMAIL, CLIENT_URL: process.env.CLIENT_URL,

    // ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY, ACCESS_TOKEN_KEY_EXPIRE_TIME:
    // process.env.ACCESS_TOKEN_KEY_EXPIRE_TIME, REFRESH_TOKEN_KEY_EXPIRE_TIME: process.env.REFRESH_TOKEN_KEY_EXPIRE_TIME, JWT_ISSUER: process.env.JWT_ISSUER, REST_PASSWORD_LINK_EXPIRE_TIME:
    // process.env.REST_PASSWORD_LINK_EXPIRE_TIME,
};

export default environmentConfig;

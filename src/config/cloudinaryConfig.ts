import Cloudinary from "cloudinary";
import envConfig from "./envConfig";

export const cloudinary = Cloudinary.v2;

// Cloudinary configuration
cloudinary.config({
    cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
    api_key: envConfig.CLOUDINARY_API_KEY,
    api_secret: envConfig.CLOUDINARY_API_SECRET,
});

export default cloudinary;

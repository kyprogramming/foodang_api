import express from "express";
import App from "./app";
import { connectDB } from "./config";
import { envConfig } from "./config";
import logger from "./logger";

const startServer = async () => {
    try {
        const app = express();
        await connectDB();
        await App(app);
        app.listen(envConfig.PORT, () => {
            console.log(`Server is listening on port: ${envConfig.PORT} - ${envConfig.NODE_ENV}`);
        });
    } catch (error: any) {
        logger.error({
            message: `MongoDB connection error.: ${error?.message}`,
        });
    }
};

// Establish http server connection
startServer();

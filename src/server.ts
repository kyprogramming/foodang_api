import express from "express";
import App from "./services/ExpressApp";
import connectDB from "./config/dbConfig";
import { envConfig } from "./config";

const startServer = async () => {
    try {
        const app = express();
        await connectDB();
        await App(app);
        app.listen(envConfig.PORT, () => {
            console.log(`Server is listening on port: http://localhost:${envConfig.PORT} - ${envConfig.NODE_ENV}`);
        });
    } catch (error: any) {
        console.log(`MongoDB connection error:  ${error?.message}`);
    }
};

// Establish http server connection
startServer();

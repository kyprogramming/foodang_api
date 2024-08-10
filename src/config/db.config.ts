import mongoose, { ConnectOptions, Error } from "mongoose";
// mongoose.set("strictQuery", true);

import { envConfig } from "./env.config";
import logger from "../logger";

const MONGODB_CON = envConfig.MONGODB_CON;
const NODE_ENV = envConfig.NODE_ENV;

if (NODE_ENV && NODE_ENV === "development") mongoose.set("debug", true);

// Connecting to MongoDB Database
export const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        if (NODE_ENV && NODE_ENV === "development") {
            console.log("MongoDB database connection established successfully");
        }
    });

    mongoose.connection.on("reconnected", () => {
        if (NODE_ENV && NODE_ENV === "development") {
            console.log("Mongo Connection Reestablished");
        }
    });

    // @event error: Emitted when an error occurs on this connection.
    mongoose.connection.on("error", (error: Error) => {
        if (NODE_ENV && NODE_ENV === "development") {
            // console.log("MongoDB connection error. Please make sure MongoDB is running: "); console.log(`Mongo Connection ERROR: ${error}`);
            logger.error({
                message: `MongoDB connection error.: ${error?.message}`,
            });
        }
    });

    // @event close
    mongoose.connection.on("close", () => {
        if (NODE_ENV && NODE_ENV === "development") {
            console.log("Mongo Connection Closed...");
        }
    });

    // @event disconnected: Emitted after getting disconnected from the db
    mongoose.connection.on("disconnected", () => {
        if (NODE_ENV && NODE_ENV === "development") {
            console.log("MongoDB database connection is disconnected...");
            console.log("Trying to reconnect to Mongo ...");

            mongoose.connect(MONGODB_CON, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        // setTimeout(() => { mongoose.connect(MONGODB_CON, { socketTimeoutMS: 3000, connectTimeoutMS: 3000, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:
        //     false, autoReconnect: true, reconnectTries: Number.MAX_VALUE, // Number of retries reconnectInterval: 1000, // Reconnect every 1 second } as ConnectOptions); }, 3000);
    });

    // @event close: Emitted after we disconnected and onClose executed on all of this connections models.
    process.on("SIGINT", () => {
        mongoose.connection.close(() => {
            if (NODE_ENV && NODE_ENV === "development") {
                console.log("MongoDB database connection is disconnected due to app termination...");
            }
            process.exit(0); // close database connection gracefully
        });
    });

    // mongoose.connect return promise
    return await mongoose.connect(MONGODB_CON, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import helmet from "helmet";
import cors from "cors";
import api from "./api";
import { envConfig } from "./config";
import { errorHandlerMiddleware, notFoundMiddleware } from "./middleware";
import cookieParser from "cookie-parser";
// import passport from "./config/passport-setup";

export default async (app: Application) => {
    const allowedOrigins = ["http://localhost:3000", "https://example.com", "https://anotherdomain.com"];
    const corsOptions = {
        origin: function (origin: string | undefined, callback: (err: Error | null, success?: boolean) => void) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    };

    const swaggerDocument = YAML.load(`${process.cwd()}/swagger/swagger.yaml`);
    const apiPath = `${envConfig.API_URL}/${envConfig.API_VERSION}`;
    const swaggerPath = `${envConfig.API_URL}/${envConfig.API_VERSION}/${envConfig.SWAGGER_DOCS}`;

    app.use(helmet({ crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false, crossOriginOpenerPolicy: false }));
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use("/static", express.static("public"));

    // Load App Middleware
    app.use(apiPath, api);
    // app.use(passport.initialize()); app.use(passport.session());
    app.use(swaggerPath, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(notFoundMiddleware);
    app.use(errorHandlerMiddleware);
    return app;
};

import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import helmet from "helmet";
import cors from "cors";
import api from "./api";
import { envConfig } from "./config";
import { errorHandlerMiddleware, notFoundMiddleware } from "./middleware";

export default async (app: Application) => {
    const swaggerDocument = YAML.load(`${process.cwd()}/swagger/swagger.yaml`);
    const apiPath = `${envConfig.API_URL}/${envConfig.API_VERSION}`;
    const swaggerPath = `${envConfig.API_URL}/${envConfig.API_VERSION}/${envConfig.SWAGGER_DOCS}`;

    app.use(helmet({ crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false, crossOriginOpenerPolicy: false }));
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/static", express.static("public"));

    // Load App Middleware
    app.use(apiPath, api);
    app.use(swaggerPath, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(notFoundMiddleware);
    app.use(errorHandlerMiddleware);
    return app;
};

import express, { Application } from "express";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { AdminRoute, DeliveryRoute, VandorRoute } from "../routes";
import { CustomerRoute } from "../routes/CustomerRoute";
import { ShoppingRoute } from "../routes/ShoppingRoutes";

export default async (app: Application) => {
    const swaggerDocument = YAML.load(`${process.cwd()}/swagger/swagger.yaml`);
    app.use("/swagger/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(express.json());

    const imagePath = path.join(__dirname, "../images");

    if (!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath, { recursive: true });
        console.log(`${imagePath} directory created.`);
    }

    app.use("/images", express.static("public"));

    app.use("/admin", AdminRoute);
    app.use("/vendor", VandorRoute);
    app.use("/customer", CustomerRoute);
    app.use("/delivery", DeliveryRoute);
    app.use(ShoppingRoute);

    return app;
};

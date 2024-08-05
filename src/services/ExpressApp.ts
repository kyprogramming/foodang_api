import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { HealthCheckRoute, AdminRoute, VendorRoute, CustomerRoute, ShoppingRoute, DeliveryRoute } from "../routes";

export default async (app: Application) => {
    const swaggerDocument = YAML.load(`${process.cwd()}/swagger/swagger.yaml`);
    app.use("/swagger/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/images", express.static("public"));

    app.use("/", HealthCheckRoute);
    app.use("/admin", AdminRoute);
    app.use("/vendor", VendorRoute);
    app.use("/customer", CustomerRoute);
    app.use("/delivery", DeliveryRoute);
    app.use(ShoppingRoute);

    return app;
};

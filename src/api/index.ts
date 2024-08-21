import express from "express";
import { HealthCheckRoute, AdminRoute, VendorRoute, CustomerRoute, DeliveryRoute, ShoppingRoute, RiderRoute } from "../routes";
const router = express.Router();

router.use("/", HealthCheckRoute);
router.use("/admin", AdminRoute);
router.use("/vendor", VendorRoute);
router.use("/customer", CustomerRoute);
router.use("/delivery", DeliveryRoute);
router.use("/rider", RiderRoute);
router.use(ShoppingRoute);

export default router;

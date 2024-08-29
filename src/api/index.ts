import express from "express";
import { HealthCheckRoute, AdminRoute, RestaurantRoute, CustomerRoute,UserRoute, DeliveryRoute, ShoppingRoute, RiderRoute, VendorRoute } from "../routes";
const router = express.Router();

router.use("/", HealthCheckRoute);
router.use("/admin", AdminRoute);
router.use("/vendor", VendorRoute);
router.use("/restaurant", RestaurantRoute);
router.use("/customer", CustomerRoute);
router.use("/user", UserRoute);
router.use("/delivery", DeliveryRoute);
router.use("/rider", RiderRoute);
router.use(ShoppingRoute);

export default router;

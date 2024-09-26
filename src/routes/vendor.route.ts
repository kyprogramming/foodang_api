import { GetVendorsService } from "./../services/vendor.service";
import express, { Request, Response, NextFunction } from "express";
import { AddVendor, GetVendorData, GetVendors, UpdateVendor, DeleteVendor } from "../controllers";
import { Authenticate } from "../middleware";

const router = express.Router();

router.post("/", AddVendor);
router.get("/", GetVendors);
router.get("/:id", GetVendorData);
router.put("/:id", UpdateVendor);
router.patch("/:id", DeleteVendor);

// Get available Food Availability
router.use(Authenticate);

export { router as VendorRoute };

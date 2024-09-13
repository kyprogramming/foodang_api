import { GetVendorsService } from "./../services/vendor.service";
import express, { Request, Response, NextFunction } from "express";
import { AddVendor, GetVendorData, GetVendors, UpdateVendor, DeleteVendor } from "../controllers";

const router = express.Router();

// Get available Food Availability
router.post("/", AddVendor);
router.get("/", GetVendors);
router.get("/:id", GetVendorData);
router.put("/:id", UpdateVendor);
router.patch("/:id", DeleteVendor);

export { router as VendorRoute };

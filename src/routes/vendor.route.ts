import { GetVendorsService } from "./../services/vendor.service";
import express, { Request, Response, NextFunction } from "express";
import { AddVendor, GetVendorData, GetVendors } from "../controllers";

const router = express.Router();

// Get available Food Availability
router.post("/", AddVendor);
router.get("/", GetVendors);
router.get("/:id", GetVendorData);

export { router as VendorRoute };

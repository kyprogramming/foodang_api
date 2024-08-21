import express, { Request, Response, NextFunction } from "express";
import { AddVendor } from "../controllers";

const router = express.Router();

// Get available Food Availability
router.post("/", AddVendor);


export { router as VendorRoute };

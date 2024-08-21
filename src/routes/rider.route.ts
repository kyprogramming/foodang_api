import express, { Request, Response, NextFunction } from "express";
import { GetRiders } from "../controllers";

const router = express.Router();

// Get available Food Availability
router.get("/", GetRiders);


export { router as RiderRoute };

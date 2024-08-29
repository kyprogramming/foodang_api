import express, { Request, Response, NextFunction } from "express";
import { AddUser } from "../controllers";

const router = express.Router();

// Get available Food Availability
router.post("/", AddUser);


export { router as UserRoute };

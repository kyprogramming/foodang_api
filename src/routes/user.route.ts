import express, { Request, Response, NextFunction } from "express";
import { AddUser, CheckEmailExist } from "../controllers";

const router = express.Router();

// Get available Food Availability
router.post("/", AddUser);
router.get("/check-email/:email", CheckEmailExist);



export { router as UserRoute };

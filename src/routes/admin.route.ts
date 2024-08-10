import express, { Request, Response, NextFunction } from "express";
import { Authenticate } from "../middleware";
import { AdminSignup, AdminLogin, CreateVendor, GetDeliveryUsers, GetTransactionById, GetTransactions, GetVendorByID, GetVendors, VerifyDeliveryUser } from "../controllers";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from  Admin" });
});

// Signup and login
router.post("/", AdminSignup);
router.post("/login", AdminLogin);

// Authentication
router.use(Authenticate);

// Create and find vendors
router.post("/vendor", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendor/:id", GetVendorByID);

// Get transactions details
router.get("/transactions", GetTransactions);
router.get("/transaction/:id", GetTransactionById);

// Verify and find delivery users
router.put("/delivery/verify", VerifyDeliveryUser);
router.get("/delivery/users", GetDeliveryUsers);

export { router as AdminRoute };

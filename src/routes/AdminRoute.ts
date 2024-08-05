import express, { Request, Response, NextFunction } from "express";
import { AdminLogin, CreateAdmin, CreateVendor, GetDeliveryUsers, GetTransactionById, GetTransactions, GetVendorByID, GetVendors, VerifyDeliveryUser } from "../controllers";
import { Authenticate } from "../middleware";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from  Admin" });
});

router.post("/", CreateAdmin);
router.post("/login", AdminLogin);

// Authentication
router.use(Authenticate);

router.post("/vendor", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendor/:id", GetVendorByID);

router.get("/transactions", GetTransactions);
router.get("/transaction/:id", GetTransactionById);

router.put("/delivery/verify", VerifyDeliveryUser);
router.get("/delivery/users", GetDeliveryUsers);

export { router as AdminRoute };

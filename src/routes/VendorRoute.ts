import express, { Request, Response, NextFunction } from "express";
import {
    AddFood,
    AddOffer,
    DeleteOffer,
    EditOffer,
    GetFoods,
    GetOffers,
    GetOrderDetails,
    GetOrders,
    GetVendorProfile,
    ProcessOrder,
    UpdateVendorCoverImage,
    UpdateVendorProfile,
    UpdateVendorStatus,
    VendorLogin,
} from "../controllers";
import { Authenticate } from "../middleware";
// import multer from "multer";
import { uploadImage } from "../middleware/file-upload";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Vendor" });
});

router.get("/login", VendorLogin);

router.use(Authenticate);

// Profile
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/service", UpdateVendorStatus);
router.patch("/coverimage", uploadImage.array("coverImage"), UpdateVendorCoverImage);

// Food
router.post("/food", uploadImage.array("foodImages"), AddFood);
router.get("/foods", GetFoods);

// Order
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderDetails);
router.put("/order/:id/process", ProcessOrder);

//Offers
router.post("/offer", AddOffer);
router.get("/offers", GetOffers);
router.put("/offer/:id", EditOffer);
router.delete("/offer/:id", DeleteOffer);

export { router as VendorRoute };

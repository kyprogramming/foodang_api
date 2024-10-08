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
    GetRestaurantProfile,
    ProcessOrder,
    UpdateRestaurantCoverImage,
    UpdateRestaurantProfile,
    UpdateRestaurantStatus,
    RestaurantLogin,
} from "../controllers";
import { Authenticate } from "../middleware";
// import multer from "multer";
import { uploadImage } from "../middleware/file-upload";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Restaurant" });
});

router.get("/login", RestaurantLogin);

router.use(Authenticate);

// Profile
router.get("/profile", GetRestaurantProfile);
router.patch("/profile", UpdateRestaurantProfile);
router.patch("/service", UpdateRestaurantStatus);
router.patch("/coverimage", uploadImage.array("coverImage"), UpdateRestaurantCoverImage);

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

export { router as RestaurantRoute };

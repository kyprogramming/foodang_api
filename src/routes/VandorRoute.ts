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
  UpdateVendorService,
  VendorLogin,
} from "../controllers";
import { Authenticate } from "../middleware";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
   cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.get("/login", VendorLogin);

router.use(Authenticate);

router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/service", UpdateVendorService);
router.patch("/coverimage", images, UpdateVendorCoverImage);

router.post("/food", images, AddFood);
router.get("/foods", GetFoods);

router.get("/orders", GetOrders);
router.put("/order/:id/process", ProcessOrder);
router.get("/order/:id", GetOrderDetails);

//Offers
router.post("/offer", AddOffer);
router.get("/offers", GetOffers);
router.put("/offer/:id", EditOffer);
router.delete("/offer/:id", DeleteOffer);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Vandor" });
});

export { router as VandorRoute };

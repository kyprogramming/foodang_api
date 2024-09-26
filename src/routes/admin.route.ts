import express, { Request, Response, NextFunction } from "express";
import { Authenticate } from "../middleware";
import { AdminSignup, AdminLogin, CreateRestaurant, GetDeliveryUsers, GetTransactionById, GetTransactions, GetRestaurantByID, GetRestaurants, VerifyDeliveryUser, AdminLogout, ValidateToken } from "../controllers";
import passport from "passport";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from  Admin" });
});

// Signup and login
router.post("/", AdminSignup);
router.post("/login", AdminLogin);
router.get("/validate-token", ValidateToken);

// Authentication
router.use(Authenticate);

// Create and find restaurants
router.post("/restaurant", CreateRestaurant);
router.get("/restaurants", GetRestaurants);
router.get("/restaurant/:id", GetRestaurantByID);

// Get transactions details
router.get("/transactions", GetTransactions);
router.get("/transaction/:id", GetTransactionById);

// Verify and find delivery users
router.put("/delivery/verify", VerifyDeliveryUser);
router.get("/delivery/users", GetDeliveryUsers);

// User SignOut
router.post("/logout", AdminLogout);

// Google OAuth routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/profile");
});

// Facebook OAuth routes
router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/profile");
});

export { router as AdminRoute };

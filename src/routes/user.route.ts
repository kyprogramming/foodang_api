import express, { Request, Response, NextFunction } from "express";
import { AddUser, CheckEmailExist, UserLogin, UserRegister, GoogleLogin, VerifyEmailOTP, UserLogout, SendOtp, VerifyMobileOtpAndRegister } from "../controllers";
import passport from "passport";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models";
import { Authenticate } from "../middleware";

const router = express.Router();

const client = new OAuth2Client("498117270511-dfrl1g10qhv935j52vvbbhtsibkssjpe.apps.googleusercontent.com");

interface Payload {
    email: string;
    name: string;
    profilePhoto: string;
}

type Provider = "email" | "google" | "facebook";

// Get available Food Availability router.post("/", AddUser);
router.get("/check-email/:email", CheckEmailExist);
router.post("/send-otp", SendOtp);
router.post("/register", VerifyMobileOtpAndRegister);
router.post("/login", UserLogin);
router.post("/auth/google", GoogleLogin);
// router.post("/register", UserRegister);
router.post("/verify-email-otp", VerifyEmailOTP);

// Authentication
router.use(Authenticate);
router.post("/logout", UserLogout);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
    res.redirect("/profile");
});

router.get("/logout", (req, res) => {
    // req.logout();
    res.redirect("/");
});

router.get("/profile", (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.redirect("/");
    }
});

export { router as UserRoute };

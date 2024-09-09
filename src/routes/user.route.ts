import express, { Request, Response, NextFunction } from "express";
import { AddUser, CheckEmailExist, Login, Register, GoogleLogin, VerifyEmailOTP, UserLogout, SendOtp, VerifyMobileOtpAndRegister, ForgotPassword, ResetPassword } from "../controllers";
import passport from "passport";

import { OAuth2Client } from "google-auth-library";
import { Authenticate } from "../middleware";

const router = express.Router();

router.get("/check-email/:email", CheckEmailExist);
router.post("/send-otp", SendOtp);
router.post("/register", VerifyMobileOtpAndRegister);
router.post("/login", Login);
router.post("/forgot-password", ForgotPassword);
router.post("/verify-email-otp", VerifyEmailOTP);
router.post("/reset-password", ResetPassword);
router.post("/auth/google", GoogleLogin);
// router.post("/register", Register);

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

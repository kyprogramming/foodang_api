import Stripe from "stripe";
import envConfig from "./envConfig";

export const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});
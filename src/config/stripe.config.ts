import Stripe from "stripe";
import envConfig from "./env.config";

export const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
});
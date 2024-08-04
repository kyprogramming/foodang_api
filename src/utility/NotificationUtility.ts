import { twilioConfig, twilioClient } from "../config";

/* ------------------- Email --------------------- */

/* ------------------- Notification --------------------- */

/* ------------------- OTP --------------------- */

export const GenerateOtp = () => {
    const otp = Math.floor(10000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

    return { otp, expiry };
};

export const SendOTP = async (otp: number, toPhoneNumber: string) => {
    try {
        return await twilioClient.messages.create({
            body: `Your OTP is ${otp}`,
            from: twilioConfig.TWILIO_PHONE_NUMBER,
            to: `+44${toPhoneNumber}`,
        });
    } catch (error) {
        console.log(error);
        return false;
    }
};

/* ------------------- Payment --------------------- */

import { twilioConfig, twilioClient } from "../config";

/* ------------------- Email --------------------- */

/* ------------------- Notification --------------------- */

/* ------------------- OTP --------------------- */

export const GenerateOtp = () => {
    let otp:number = Math.floor(100000 + Math.random() * 900000);
    let expireAt = new Date();
    expireAt.setTime(new Date().getTime() + 5 * 60 * 1000);
    return { otp, expireAt };
};

export const SendOTP = async (otp: number, callingCode: string, toPhoneNumber: string) => {
    try {
        return await twilioClient.messages.create({
            body: `Your XGo OTP is ${otp}`,
            from: twilioConfig.TWILIO_PHONE_NUMBER,
            to: `${callingCode}${toPhoneNumber}`,
        });
    } catch (error: any) {
        console.log(error);
        return false;
    }
};

/* ------------------- Payment --------------------- */

import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from "../config";
/* ------------------- Email --------------------- */

/* ------------------- Notification --------------------- */

/* ------------------- OTP --------------------- */

export const GenerateOtp = () => {
 const otp = Math.floor(10000 + Math.random() * 900000);
 let expiry = new Date();
 expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

 return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
 try {
  const accountSid = TWILIO_ACCOUNT_SID;
  const authToken = TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
   body: `Your OTP is ${otp}`,
   from: TWILIO_PHONE_NUMBER,
   to: `+44${toPhoneNumber}`,
  });

  return response;
 } catch (error) {
  console.log(error);
  return false;
 }
};

/* ------------------- Payment --------------------- */

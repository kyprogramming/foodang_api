import { Twilio } from 'twilio';

const twilioClient = new Twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export const sendOTP = (to: string, otp: string) => {
    return twilioClient.messages.create({
        body: `Your verification code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to
    });
};

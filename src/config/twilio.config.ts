import { Twilio } from 'twilio';

export const twilioConfig = {
    TWILIO_SID: process.env.TWILIO_SID!,
    TWILIO_AUTH_TOKEN:process.env.TWILIO_AUTH_TOKEN!,
    TWILIO_PHONE_NUMBER:process.env.TWILIO_PHONE_NUMBER
};

export const twilioClient = new Twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

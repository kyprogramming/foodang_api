export interface IOtp extends Document {
    email: string;
    mobile: string;
    callingCode: string;
    otp: number; // The generated OTP code
    expireAt: Date; // The timestamp when the OTP will expire
}
export default IOtp;

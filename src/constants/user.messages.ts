export enum SuccessMessages {
    USER_AUTH_SUCCESS = "Authenticated successfully._Continue to order your food.🥗",
    USER_CREATE_SUCCESS = "Account created successfully._Continue to login.🚀",
    USER_EMAIL_VERIFY_SUCCESS = "Email verified successfully._Now you are eligible for offer.🎁",
    USER_LOGOUT_SUCCESS = "Logout successful._See you soon.🌝",
}

export enum ErrorMessages {
    USER_AUTH_ERROR = "Authentication failed._Invalid credentials.",
    USER_ALREADY_EXIST = "Account already exists with this email id._Continue to login",
    USER_NOT_FOUND = "Email id is not registered with us._Continue to register.",
    USER_VERIFY_ERROR = "Error while user verification._Please try later.",
    USER_INVALID_CREDENTIALS = "Authentication failed._Invalid credentials.😢",
    USER_INVALID_OTP = "OTP verification failed._Invalid OTP.",
    USER_EXPIRED_OTP = "OTP verification failed._OTP has expired, try with resend OTP.",
}

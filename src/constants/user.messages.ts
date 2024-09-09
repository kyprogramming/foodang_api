export enum SuccessMessages {
    USER_AUTH_SUCCESS = "Authenticated successfully._Continue to order your food.🥗",
    USER_CREATE_SUCCESS = "Account created successfully._Continue to login.🚀",
    USER_EMAIL_VERIFY_SUCCESS = "Email verified successfully._Now you are eligible for offer.🎁",
    USER_LOGOUT_SUCCESS = "Logout successful._See you soon.🌝",
    USER_PWD_RESET_LINK_SENT_SUCCESS = "Reset password link sent to your email._Continue to check your email.🌝",
    USER_EMAIL_OTP_SENT_SUCCESS = "OTP sent to your email._Continue to check your email adn verify.🌝",
    USER_EMAIL_OTP_VERIFY_SUCCESS = "OTP verified successfully._Continue to reset your password.🌝",
    USER_PWD_RESET_SUCCESS = "Password reset successful._Continue to login with your new password.🌝",
}

export enum ErrorMessages {
    USER_AUTH_ERROR = "Authentication failed._Invalid credentials.",
    USER_ALREADY_EXIST = "Account already exists with this email id._Continue to login",
    USER_NOT_FOUND = "Email id is not registered with us._Continue to register.",
    USER_VERIFY_ERROR = "Error while user verification._Please try later.",
    USER_INVALID_CREDENTIALS = "Authentication failed._Invalid credentials.😢",
    USER_INVALID_OTP = "OTP verification failed._Invalid OTP.",
    USER_EXPIRED_OTP = "OTP verification failed._OTP has expired, try with resend OTP.",
    USER_INVALID_TOKEN = "Invalid token._Token is invalid or expired.",
    USER_EMAIL_OTP_VERIFY_ERROR = "OTP verification failed._OTP doesn't match or expired.🌝",
}

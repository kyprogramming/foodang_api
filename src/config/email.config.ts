import * as Mailjet from "node-mailjet";
import envConfig from "./env.config";

const mailjetClient = new Mailjet.Client({
    apiKey: envConfig.MAILJET_API_KEY,
    apiSecret: envConfig.MAILJET_API_SECRET,
});

export const sendEmail = async () => {
    const request = {
        Messages: [
            {
                From: {
                    Email: envConfig.MAILJET_SENDER,
                    Name: "xGo",
                },
                To: [
                    {
                        Email: "maneesha11090@gmail.com",
                        Name: "Maneesha yadav",
                    },
                ],
                Subject: "Test Email",
                TextPart: "This is a test email sent using Mailjet.",
                HTMLPart: "<h3>This is a test email sent using Mailjet.</h3>",
            },
        ],
    };

    try {
        const result = await mailjetClient.post("send", { version: "v3.1" }).request(request);
        console.log(result.body);
    } catch (error: any) {
        console.error(error);
    }
};

export const sendResetPasswordEmail = async (to: string, name: string, resetLink: string) => {
    const request = {
        Messages: [
            {
                From: { Email: envConfig.MAILJET_SENDER, Name: "xGo" },
                To: [{ Email: to, Name: name }],
                Subject: "Password Reset",
                // TextPart: ``, //TODO: TextPart is not working properly, need to verify - optional
                HTMLPart: `<h5>Hi ${name},</h5> 
                <p>You have requested for a password reset. Click the below link to reset your password.</p>
                <b>Password reset link</b>: ${resetLink}
                <h3>XGo Team</h3>`,
            },
        ],
    };
    try {
        return await mailjetClient.post("send", { version: "v3.1" }).request(request);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send reset password email");
    }
};

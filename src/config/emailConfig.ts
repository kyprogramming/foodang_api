import * as Mailjet from "node-mailjet";
import envConfig from "./envConfig";

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
                    Name: "Kumar Programming",
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
    } catch (error) {
        console.error(error);
    }
};

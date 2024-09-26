import crypto from "crypto";
import {envConfig} from "../config/env.config";

const algorithm = "aes-256-cbc";
const key = Buffer.from(envConfig.ENCRYPTION_KEY, "hex");

export function encryptObject(obj) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const jsonString = JSON.stringify(obj);
    let encrypted = cipher.update(jsonString);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptObject(encryptedData) {
    const textParts = encryptedData.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(decrypted.toString());
}

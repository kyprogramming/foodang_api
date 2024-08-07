import dotenv from "dotenv-safe";

import { buildDevLogger } from "./devLogger";
import { buildProdLogger } from "./prodLogger";

dotenv.config();
let logger: any = null;
if (process.env.NODE_ENV === "development") {
    logger = buildDevLogger();
} else {
    logger = buildProdLogger();
}

export default logger;

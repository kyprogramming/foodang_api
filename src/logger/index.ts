import dotenv from "dotenv-safe";

import { buildDevLogger } from "./dev.logger";
import { buildProdLogger } from "./prod.logger";

dotenv.config();
let logger: any = null;
if (process.env.NODE_ENV === "development") {
    logger = buildDevLogger();
} else {
    logger = buildProdLogger();
}

export default logger;

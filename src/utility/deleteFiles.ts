import fs from "fs";
import { envConfig } from "../config";

export const deleteFile = (filePath: fs.PathLike) => {
    fs.stat(filePath, function (err, stats) {
        if (envConfig.NODE_ENV && envConfig.NODE_ENV === "development") {
            console.log(stats); // here we got all information of file in stats variable
        }
        if (err && envConfig.NODE_ENV && envConfig.NODE_ENV === "development") {
            console.log("fail to find file path", err);
            // throw new Error('fail to find file path');
        } else {
            fs.unlink(filePath, function (error) {
                if (error && envConfig.NODE_ENV && envConfig.NODE_ENV === "development") {
                    console.log("fail to delete the file", error);
                    // throw error;
                }
                if (envConfig.NODE_ENV && envConfig.NODE_ENV === "development") {
                    console.log("successfully deleted file ");
                }
            });
        }
    });
};

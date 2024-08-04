import express from "express";
import App from "./services/ExpressApp";
import connectDB from "./config/dbConfig";
import { PORT } from "./config";

const StartServer = async () => {
  const app = express();

  await connectDB();

  await App(app);

  app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
  });
};

StartServer();

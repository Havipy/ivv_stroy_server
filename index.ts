import express from "express";
import cors from "cors";
import { router } from "./routes/contacts.routes";
import mongoose from "mongoose";
import "dotenv/config";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["https://ivv-stroy-client.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => {
    console.log("connected to mongodb successfully");
  })

  .catch((error) => console.log(error));

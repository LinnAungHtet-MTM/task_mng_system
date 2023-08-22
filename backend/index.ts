import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import projectRouter from "./src/routes/projectRoute";
import employeeRouter from "./src/routes/employeeRoute";
import taskRouter from "./src/routes/taskRoute";
import reportRouter from "./src/routes/reportRoute";
import authRouter from "./src/routes/authRoute";
import notiRouter from "./src/routes/notiRoute";
import notiTaskRouter from "./src/routes/notiTaskRoute";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import cors from "cors";
import { configSocket } from "./socket";
dotenv.config();

cloudinary.config({
  cloud_name: "dvgny2fza",
  api_key: "533436227356872",
  api_secret: "Ah8k69bn6DACd1EBe2Lmgx1-KnQ",
});

const app = express();
const server = http.createServer(app);
configSocket(server);

const PORT = process.env.PORT;

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/project", projectRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/task", taskRouter);
app.use("/api/report", reportRouter);
app.use("/auth", authRouter);
app.use("/api/notification", notiRouter);
app.use("/api/taskNoti", notiTaskRouter);

mongoose
  .connect(process.env.MONGO_URL || "")
  .then(() => {
    console.log("database is connected");
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect to database`));

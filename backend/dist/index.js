"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const projectRoute_1 = __importDefault(require("./src/routes/projectRoute"));
const employeeRoute_1 = __importDefault(require("./src/routes/employeeRoute"));
const taskRoute_1 = __importDefault(require("./src/routes/taskRoute"));
const reportRoute_1 = __importDefault(require("./src/routes/reportRoute"));
const authRoute_1 = __importDefault(require("./src/routes/authRoute"));
const notiRoute_1 = __importDefault(require("./src/routes/notiRoute"));
const notiTaskRoute_1 = __importDefault(require("./src/routes/notiTaskRoute"));
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./socket");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: "dvgny2fza",
    api_key: "533436227356872",
    api_secret: "Ah8k69bn6DACd1EBe2Lmgx1-KnQ",
});
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, socket_1.configSocket)(server);
const PORT = process.env.PORT;
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use("/api/project", projectRoute_1.default);
app.use("/api/employee", employeeRoute_1.default);
app.use("/api/task", taskRoute_1.default);
app.use("/api/report", reportRoute_1.default);
app.use("/auth", authRoute_1.default);
app.use("/api/notification", notiRoute_1.default);
app.use("/api/taskNoti", notiTaskRoute_1.default);
mongoose_1.default
    .connect(process.env.MONGO_URL || "")
    .then(() => {
    console.log("database is connected");
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
    .catch((error) => console.log(`${error} did not connect to database`));

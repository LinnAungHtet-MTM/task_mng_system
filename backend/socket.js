"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSocket = void 0;
const socket_io_1 = require("socket.io");
const connectedSockets = new Set();
const configSocket = (socket) => {
    const io = new socket_io_1.Server(socket, {
        cors: {
            origin: "*",
        },
    });
    io.on("connection", (socket) => {
        connectedSockets.add(socket);
        socket.on("reportCreate", (data) => {
            socket.broadcast.emit("reportCreate", data);
        });
        socket.on("taskCreate", (data) => {
            socket.broadcast.emit("taskCreate", data);
        });
        socket.on("taskUpdate", () => {
            socket.broadcast.emit("taskUpdate");
        });
    });
};
exports.configSocket = configSocket;

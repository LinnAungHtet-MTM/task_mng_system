import { Server, Socket } from "socket.io";

const connectedSockets: Set<Socket> = new Set();

export const configSocket = (socket: any) => {
  const io = new Server(socket, {
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
    socket.on("createEmployee", () => {
      socket.broadcast.emit("employeeCreated");
    });
    socket.on("editEmployee", () => {
      socket.broadcast.emit("employeeEdit");
    });
    socket.on("deleteEmployee", () => {
      socket.broadcast.emit("employeeDelete");
    });
    socket.on("createProject", () => {
      socket.broadcast.emit("projectCreate");
    });
    socket.on("editProject", () => {
      socket.broadcast.emit("projectEdit");
    });
    socket.on("deleteProject", () => {
      socket.broadcast.emit("projectDelete");
    });
  });
};

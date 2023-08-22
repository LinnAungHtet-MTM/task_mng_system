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
  });
};

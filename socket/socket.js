const { Server } = require("socket.io");

const socketConnectionHandler = (httpServer) => {
   let io = new Server(httpServer, {
      cors: {
         origin: "http://localhost:5173", // Adjust the front-end URL as needed
         methods: ["GET", "POST"],
         credentials: true,
      },
   });

   io.on("connection", (socket) => {
      socket.on("message", (msg) => {
         console.log(msg, "messge_________________");
      });

      socket.on("disconnect", () => {
         console.log("socket disconnected");
      });
   });
   return io;
};

module.exports = socketConnectionHandler;

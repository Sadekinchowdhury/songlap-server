const { Server } = require("socket.io");

const socketConnectionHandler = (httpServer) => {
   let conversationId;
   let io = new Server(httpServer, {
      cors: {
         origin: "http://localhost:5173", // Adjust the front-end URL as needed
         methods: ["GET", "POST"],
         credentials: true,
      },
   });

   io.on("connection", (socket) => {
      console.log("socket is connected now_____________________>>>>>>>>>>>");

      // for instant delete msg
      socket.on("joinConversation", (conversationId) => {
         socket.join(conversationId);
      });

      // Join a room
      socket.on("join", (roomId) => {
         socket.join(roomId);
      });

      socket.on("converSationId", (id) => {
         conversationId = id;
         socket.broadcast.emit("joinconversationId", id);
      });

      socket.on("sendOffer", (data) => {
         socket.broadcast.emit("receiveOffer", data);
      });

      socket.on("sendAnswer", (data) => {
         socket.broadcast.emit("receiveAnswer", data);
      });

      socket.on("endCall", () => {
         socket.broadcast.emit("endCall");
      });

      // // Handle ICE candidate from the client
      // socket.on("sendIceCandidate", (candidate) => {
      //    console.log("📩 ICE Candidate received:", candidate);
      //    // Send ICE candidate to the other client (broadcast)
      //    socket.broadcast.emit("receiveIceCandidate", candidate);
      // });

      socket.on("disconnect", () => {
         console.log("socket disconnected");
      });
   });
   return io;
};

module.exports = socketConnectionHandler;

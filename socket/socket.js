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
      socket.on("call-request", ({ senderId, recipientId, callType, callId }) => {
         socket.broadcast.emit("incoming-call", { senderId, recipientId, callType, callId });
      });
      socket.on("call-details", (data) => {
         io.emit("callInfo", data);
      });

      socket.on("callData", (data) => {
     
         socket.broadcast.emit("callData", data);
      });

      socket.on("sendOffer", (data) => {
         socket.broadcast.emit("receiveOffer", data);
      });

      socket.on("sendAnswer", (data) => {
         socket.broadcast.emit("receiveAnswer", data);
      });
      socket.on("call-missed", ({ senderId, recipientId }) => {
         socket.broadcast.emit("endCall", { senderId, recipientId });
      });

      socket.on("call-rejected", ({ callerId, receiverId }) => {
         socket.broadcast.emit("endCall", { senderId: callerId, recipientId: receiverId });
      });

      socket.on("disconnect", () => {
         console.log("socket disconnected");
      });
   });
   return io;
};

module.exports = socketConnectionHandler;

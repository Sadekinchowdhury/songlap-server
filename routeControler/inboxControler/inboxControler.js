const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");
const path = require("path");

// Send Message
const sendMessage = async (req, res, next) => {
   try {
      let newMessage;
      const { text, conversation_id, sender, receiver } = req.body;

      if (req.files && req.files.length > 0) {
         newMessage = new Message({
            ...req.body,
            attachment: path.join("/uploads/avatar", req.files[0].filename),
            text,
            conversation_id,
            sender: JSON.parse(sender),
            receiver: JSON.parse(receiver),
         });
      } else {
         newMessage = new Message({
            ...req.body,
            text,
            conversation_id,
            sender: JSON.parse(sender),
            receiver: JSON.parse(receiver),
         });
      }

      await newMessage.save();

      // Update last_updated field in the Conversation model
      await Conversation.findByIdAndUpdate(conversation_id, {
         last_updated: new Date(),
      });
      req.io.emit("message", { data: newMessage });
      res.status(200).json({ data: newMessage });
   } catch (err) {
      res.status(500).json({
         message: err,
      });
   }
};

// Get Message
const getMessage = async (req, res, next) => {
   try {
      const id = req.params.id;
      const message = await Message.find({ conversation_id: id });
      if (!message) {
         return res.status(404).json({ message: "Message not found" });
      }

      res.status(200).json({ data: message });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// Find user conversation by id
const findConverSation = async (req, res, next) => {
   try {
      const id = req.params.id;
      const singleConversation = await Conversation.findById(id);

      if (!singleConversation) {
         return res.status(404).json({ singleConversation: "Conversation not found" });
      }

      res.status(200).json({ data: singleConversation });
   } catch (err) {
      res.status(500).json({ singleConversation: err.message });
   }
};

const deleteMessage = async (req, res, next) => {
   try {
      const { msgConversationId, msgId } = req.query;

      // Validate query parameters
      if (!msgConversationId || !msgId) {
         return res.status(400).json({ error: "msgConversationId and msgId are required" });
      }

      // Delete message with matching conversation_id, message _id, and sender id
      const deleteMsg = await Message.findOneAndDelete({
         conversation_id: msgConversationId,
         _id: msgId,
         "sender.id": req.user.userid,
      });

      if (!deleteMsg) {
         return res.status(404).json({ error: "Message not found or unauthorized to delete" });
      }

      req.io.to(msgConversationId).emit("messageDeleted", { msgId });
      res.status(200).json({
         success: true,
         message: "Message deleted successfully",
         data: deleteMsg,
      });
   } catch (err) {
      console.error("Error deleting message:", err);
      res.status(500).json({ error: "Server error", details: err.message });
   }
};

// const callStation = async (req, res, next) => {
//    try {

//    } catch (err) {
//       res.join(err);
//    }
// };

module.exports = { sendMessage, getMessage, findConverSation, deleteMessage };

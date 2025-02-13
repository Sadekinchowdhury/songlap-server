const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");
const path = require("path");

const sendMessage = async (req, res, next) => {
   try {
      let newMessage;
      const { text, conversation_id, sender, receiver } = req.body;

      if (req.files && req.files.length > 0) {
         console.log(`/uploads/avatar/${req.files[0].filename}`);
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
      console.log(result);
      res.status(200).json({ data: result });
   } catch (err) {
      res.status(500).json({
         message: err,
      });
   }
};
const getMessage = async (req, res, next) => {
   try {
      const id = req.params.id;
      // Correct: Pass id directly
      const message = await Message.find({ conversation_id: id });
      if (!message) {
         return res.status(404).json({ message: "Message not found" });
      }
      res.status(200).json({ data: message });
   } catch (err) {
      console.error("Error fetching message:", err);
      res.status(500).json({ message: err.message });
   }
};

const findConverSation = async (req, res, next) => {
   try {
      const id = req.params.id;

      // Fetch conversation by ID
      const singleConversation = await Conversation.findById(id);

      if (!singleConversation) {
         return res.status(404).json({ singleConversation: "Conversation not found" });
      }

      res.status(200).json({ data: singleConversation });
   } catch (err) {
      res.status(500).json({ singleConversation: err.message });
   }
};

// const getMessage = async (req, res, next) => {
//    try {
//    } catch (err) {
//       res.status.json({
//          message: err,
//       });
//    }
// };
module.exports = { sendMessage, getMessage, findConverSation };

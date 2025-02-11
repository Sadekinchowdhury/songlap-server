const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");

const sendMessage = async (req, res, next) => {
   try {
      const data = req.body;
      if (data) {
         const message = await new Message(data);
         const result = await message.save();
         console.log(result);
         res.status(200).json({ data: result });
      }
   } catch (err) {
      res.status(500).json({
         message: err,
      });
   }
};
const getMessage = async (req, res, next) => {
   try {
      const id = req.params.id;
      console.log("message id", id);

      // Correct: Pass id directly
      const message = await Message.find({ conversation_id: id });
      console.log(message);

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

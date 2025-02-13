const Conversation = require("../../models/Conversation");

const addConversation = async (req, res, next) => {
   try {
      const { participant_id, name, avatar } = req.body;

      if (!req.user || !req.user.userid) {
         return res.status(401).json({ message: "Unauthorized access" });
      }

      if (!participant_id) {
         return res.status(400).json({ message: "Participant ID and name are required" });
      }
      // Check if the conversation already exists
      const existingConversation = await Conversation.findOne({
         $or: [
            { "creator.id": req.user.userid, "participant.id": participant_id },
            { "creator.id": participant_id, "participant.id": req.user.userid },
         ],
      });

      if (existingConversation) {
         console.log("exist");
         return res.status(200).json({
            success: true,
            message: "Conversation already exists",
            data: existingConversation,
         });
      }
      // Create a new conversation if not exists
      const newConversation = new Conversation({
         creator: {
            id: req.user.userid,
            name: req.user.name,
            avatar: req.user.avatar || null,
         },
         participant: {
            id: participant_id,
            name: name,
            avatar: avatar || null,
         },
      });

      const result = await newConversation.save();

      res.status(201).json({
         success: true,
         message: "Conversation created successfully",
         data: result,
      });
   } catch (err) {
      res.status(500).json({
         success: false,
         message: err.message || "Internal Server Error",
      });
   }
};

module.exports = { addConversation };

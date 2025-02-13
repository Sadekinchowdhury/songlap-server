const Conversation = require("../../models/Conversation");

const getConversation = async (req, res, next) => {
   try {
      if (req.user && req.user.userid) {
         const userConversations = await Conversation.find({
            $or: [{ "creator.id": req.user.userid }, { "participant.id": req.user.userid }],
         });

         if (userConversations.length === 0) {
            return res.status(404).json({
               message: "No conversations found for this user",
            });
         }

         res.status(200).json({
            data: userConversations,
         });
      } else {
         return res.status(401).json({
            message: "Unauthorized access, user not authenticated",
         });
      }
   } catch (err) {
      res.status(500).json({
         message: err.message || "Internal Server Error",
      });
   }
};

module.exports = { getConversation };

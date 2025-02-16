const Conversation = require("../../models/Conversation");

const getConversation = async (req, res, next) => {
   try {
      if (req.user && req.user.userid) {
         const userid = req.user.userid;

         // Find conversations where user is either creator or participant
         const userConversations = await Conversation.find({
            $or: [{ "creator.id": userid }, { "participant.id": userid }],
         });

         // Map conversations to show only the opposite party
         const conversations = userConversations.map((conversation) => {
            if (conversation.creator.id.toString() === userid) {
               return {
                  id: conversation._id,
                  user: conversation.participant,
                  last_updated: conversation.last_updated,
               };
            } else {
               return {
                  id: conversation._id,
                  user: conversation.creator,
                  last_updated: conversation.last_updated,
               };
            }
         });

         res.status(200).json({
            data: conversations,
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

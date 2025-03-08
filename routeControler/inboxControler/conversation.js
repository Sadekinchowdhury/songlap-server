const Conversation = require("../../models/Conversation");
const getFavouriteConversation = async (req, res, next) => {
   try {
      const id = req.user.userid;

      const allConverSation = await Conversation.find({
         $or: [{ "creator.id": id }, { "participant.id": id }],
      });

      res.json(allConverSation);
   } catch (err) {
      res.status(400).json({
         err: err,
      });
   }
};
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
                  conversation,
               };
            } else {
               return {
                  id: conversation._id,
                  user: conversation.creator,
                  last_updated: conversation.last_updated,
                  conversation,
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
const addFavourite = async (req, res, next) => {
   try {
      const id = req.params.id;
      const { isFavourite, creatorId, name, avatar } = req.body;

      const isFavouriteBoolean = Boolean(isFavourite);

      const updatedConversation = await Conversation.findByIdAndUpdate(
         id,
         {
            $set: {
               "favourite.isFavourite": Boolean(isFavouriteBoolean), // Ensure it's a Boolean
               "favourite.name": name,
               "favourite.creatorId": creatorId,
               "favourite.avatar": avatar,
            },
         },
         { new: true, runValidators: true }
      );

      if (!updatedConversation) {
         return res.status(404).json({ msg: "Conversation not found" });
      }

      res.status(200).json({
         msg: "Added to favourites successfully",
         conversation: updatedConversation,
      });
   } catch (err) {
      res.status(500).json({
         msg: "An error occurred",
         error: err.message,
      });
   }
};

module.exports = { getConversation, addFavourite, getFavouriteConversation };

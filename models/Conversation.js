const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema(
   {
      creator: {
         id: { type: mongoose.Types.ObjectId, required: true },
         name: { type: String, required: true },
         avatar: { type: String },
      },

      participant: {
         id: { type: mongoose.Types.ObjectId, required: true },
         name: { type: String, required: true },
         avatar: { type: String },
      },

      favourite: {
         creatorId: { type: mongoose.Types.ObjectId, required: false },
         name: { type: String, required: false },
         avatar: { type: String, required: false },
         isFavourite: {
            type: Boolean,
            default: false,
         },
      },

      lastMessage: {
         text: String,
      },

      last_updated: {
         type: Date,
         default: Date.now,
      },
   },
   {
      timestamps: true,
   }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;

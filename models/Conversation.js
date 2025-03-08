const { model, default: mongoose } = require("mongoose");

const ConverSationSchema = mongoose.Schema(
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
         creatorId: { type: mongoose.Types.ObjectId },
         name: { type: String },
         avatar: { type: String },
         isFavourite: {
            type: Boolean,
            default: false,
         },
      },

      last_updated: {
         type: Date,
         default: Date.now,
      },
   },
   {
      timestamps: true, // This automatically adds `createdAt` and `updatedAt`
   }
);

const Conversation = mongoose.model("Conversation", ConverSationSchema);

module.exports = Conversation;

const { model, default: mongoose } = require("mongoose");

const ConverSationSchema = mongoose.Schema(
   {
      creator: {
         id: mongoose.Types.ObjectId,
         name: String,
         avatar: String,
      },

      participant: {
         id: mongoose.Types.ObjectId,
         name: String,
         avatar: String,
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

const Conversation = mongoose.model("Conversation", ConverSationSchema);

module.exports = Conversation;

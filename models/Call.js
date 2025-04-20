const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const callSchema = new mongoose.Schema(
   {
      conversationId: {
         type: String,
         required: true,
      },
      sender: {
         id: {
            type: String,
            required: true,
         },
         name: {
            type: String,
            required: true,
         },
         avatar: {
            type: String,
         },
         lastOnline: {
            type: Date,
         },
      },
      receiver: {
         id: {
            type: String,
            required: true,
         },
         name: {
            type: String,
            required: true,
         },
         avatar: {
            type: String,
         },
         lastOnline: {
            type: Date,
         },
      },
      callDuration: {
         type: String,
      },
      callStatus: {
         type: String,
         enum: ["missed", "answered", "rejected", "ended"],
      },
      callType: {
         type: String,
         enum: ["audio", "video"],
      },
      startTime: {
         type: String,
      },
      endTime: {
         type: String,
      },
   },
   { timestamps: true }
);

const Call = mongoose.model("Call", callSchema);

module.exports = Call;

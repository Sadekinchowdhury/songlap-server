const { default: mongoose } = require("mongoose");
const Call = require("../../models/Call");

const startNewCall = async (req, res, next) => {
   try {
      const { conversationId, sender, receiver, callDuration, callStatus, callType, startTime } = req.body;

      if (!conversationId || !sender || !receiver || !callType) {
         return res.status(400).json({ status: "Error", message: "Missing required fields" });
      }

      const newCall = new Call({ conversationId, sender, receiver, callDuration, callStatus, callType, startTime });

      await newCall.save();

      req.io.emit("id", newCall._id);
      res.status(200).json({ status: "success", callDetails: newCall });
   } catch (err) {
       
      res.status(500).json({ status: "Error", message: "An error occurred while saving the call", error: err.message });
   }
};

const updateCallStatus = async (req, res, next) => {
   try {
      let { callStatus, callId } = req.body;

      // Validate callId
      if (!mongoose.Types.ObjectId.isValid(callId)) {
         return res.status(400).json({
            status: "Error",
            message: "Invalid call ID.",
         });
      }

      // Validate and normalize callStatus
      if (typeof callStatus !== "string") {
         return res.status(400).json({
            status: "Error",
            message: "callStatus must be a string.",
         });
      }

      callStatus = callStatus.toLowerCase();

      if (!["answered", "rejected", "ended"].includes(callStatus)) {
         return res.status(400).json({
            status: "Error",
            message: "Invalid call status. Only 'answered', 'rejected', or 'ended' are allowed.",
         });
      }

      // Find the call document
      const callDoc = await Call.findById(callId);
      if (!callDoc) {
         return res.status(404).json({
            status: "Error",
            message: "Call not found.",
         });
      }

      const updateData = { callStatus };

      // Only if the call is "ended", calculate time details
      if (callStatus === "ended") {
         const end = new Date();
         const start = callDoc.createdAt ? new Date(callDoc.createdAt) : null;

         const formatTime = (date) => {
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            return `${hours}:${minutes}:${seconds}`;
         };

         updateData.endTime = formatTime(end);

         const durationInSeconds = Math.floor((end - start) / 1000);
         const hours = String(Math.floor(durationInSeconds / 3600)).padStart(2, "0");
         const minutes = String(Math.floor((durationInSeconds % 3600) / 60)).padStart(2, "0");
         const seconds = String(durationInSeconds % 60).padStart(2, "0");

         updateData.callDuration = `${hours}:${minutes}:${seconds}`;
      }

      // Update in DB
      const updatedCall = await Call.findByIdAndUpdate(callId, updateData, { new: true });

      // Emit update to client
      req?.io?.emit("callStatusUpdate", updatedCall);

      return res.json({
         status: "success",
         callDetails: updatedCall,
      });
   } catch (err) {
 
      return res.status(500).json({
         status: "Error",
         message: "An error occurred while updating call status.",
         error: err.message,
      });
   }
};

const callHistory = async (req, res, next) => {
   try {
      const userId = req.user.userid;
      const calls = await Call.find({
         $or: [{ "sender.id": userId }, { "receiver.id": userId }],
      }).sort({ createdAt: -1 }); 
      res.json({ status: "success", calls });
   } catch (err) {
  
      return res.status(500).json({
         status: "Error",
         message: "An error occurred while fetching call history.",
         error: err.message,
      });
   }
};

module.exports = { startNewCall, updateCallStatus, callHistory };

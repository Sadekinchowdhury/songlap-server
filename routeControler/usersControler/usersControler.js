const createHttpError = require("http-errors");
const Users = require("../../models/Users");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");

// Get all users
const getAllUsers = async (req, res, next) => {
   try {
      const findUser = await Users.find({});
      res.json(findUser);
   } catch (err) {
      next(err);
   }
};

// find user for login information
const getUser = async (req, res, next) => {
   try {
      if (!req.user) {
         return next(createHttpError(401, "User not authenticated"));
      }

      // Find user from database by ID
      const user = await Users.findById(req.user.userid);
      if (!user) {
         return next(createHttpError(404, "User not found"));
      }

      return res.status(200).json({
         success: true,
         message: "User information updated successfully",
         user,
      });
   } catch (err) {
      return next(createHttpError(500, "Internal Server Error"));
   }
};

// search user for conversation
const searchUser = async (req, res, next) => {
   try {
      let { email_or_phone } = req.body;
      email_or_phone = email_or_phone.trim().toLowerCase();

      let user = await Users.find({
         $or: [{ email: email_or_phone }, { mobile: email_or_phone }, { name: email_or_phone }],
      });
      if (user) {
         res.status(200).json({
            data: user,
         });
      }
   } catch (err) {
      console.log(err);
      res.status(404).json({
         message: err,
      });
   }
};

// find user by id
const getUsersById = async (req, res, next) => {
   try {
      const id = req.params.id;
      const findUser = await Users.findById(id);
      if (!findUser) {
         return next(createHttpError(404, "User not found"));
      }
      res.json(findUser);
   } catch (err) {
      next(err);
   }
};

// User Registation
const postUsers = async (req, res, next) => {
   let newUser;
   const password = await bcrypt.hash(req.body.password, 10);

   if (req.files && req.files.length > 0) {
      newUser = new Users({
         ...req.body,
         avatar: req.files[0].filename,
         password: password,
      });
   } else {
      newUser = new Users({
         ...req.body,
         password: password,
      });
   }
   try {
      const result = await newUser.save();
      // Send a success response
      res.status(200).json({ result, success: true, message: "User created successfully!" });
   } catch (err) {
      next(err);
   }
};

// Update user
const updateUser = async (req, res, next) => {
   try {
      const id = req.params.id; // User ID
      const { name } = req.body;
      const avatar = req.files?.[0]?.filename || null; // Check if a new avatar is uploaded

      // Update the user in the Users collection
      const updatedUser = await Users.findByIdAndUpdate(
         id,
         {
            $set: {
               name: name,
               avatar: avatar,
            },
         },
         { new: true, runValidators: true }
      );

      if (!updatedUser) {
         return res.status(404).json({ message: "User not found" });
      }

      // Update all conversations where the user is the creator
      await Conversation.updateMany(
         { "creator.id": id },
         {
            $set: {
               "creator.name": name,
               "creator.avatar": avatar,
            },
         }
      );

      // Update all conversations where the user is a participant
      await Conversation.updateMany(
         { "participant.id": id },
         {
            $set: {
               "participant.name": name,
               "participant.avatar": avatar,
            },
         }
      );

      // Update all messages where the user is the sender
      await Message.updateMany(
         { "sender.id": id },
         {
            $set: {
               "sender.name": name,
               "sender.avatar": avatar,
            },
         }
      );

      // Update all messages where the user is the receiver
      await Message.updateMany(
         { "receiver.id": id },
         {
            $set: {
               "receiver.name": name,
               "receiver.avatar": avatar,
            },
         }
      );

      res.status(200).json({
         success: true,
         message: "User, conversations, and messages updated successfully!",
         updatedUser,
      });
   } catch (err) {
      console.log(err, "this is error___________");
      next(err);
   }
};

// Delete user
const deleteUser = async (req, res, next) => {
   try {
      const userid = req.params.id;

      // user find by id for deleting avatar on file system
      const findAvatar = await Users.findById({ _id: userid });

      const user = await Users.deleteOne({ _id: userid });
      const rootDir = path.resolve(__dirname, "../../");

      let url = path.join(rootDir, `/public/uploads/avatar/${findAvatar.avatar}`);

      fs.unlink(url, (err) => {
         if (err) {
            console.error("Error deleting file:", err);
         } else {
            console.log("File deleted successfully");
         }
      });

      if (user.deletedCount === 0) {
         return next(createHttpError(404, "User not found"));
      }

      res.json({ message: "User deleted successfully" });
   } catch (err) {
      next(err);
   }
};

// Delete all users
const deleteAll = async (req, res, next) => {
   try {
      const result = await Users.deleteMany({});
      res.status(200).json({
         success: true,
         message: "all users deleted",
         result,
      });
   } catch (err) {
      res.status(500).json({
         success: false,
         message: "User not delete",
      });
   }
};

module.exports = { getUser, searchUser, getAllUsers, postUsers, getUsersById, updateUser, deleteUser, deleteAll };

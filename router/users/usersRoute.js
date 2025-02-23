const express = require("express");
const {
   getUsersById,
   deleteUser,
   postUsers,
   deleteAll,
   getAllUsers,
   getUser,
   searchUser,
   updateUser,
} = require("../../routeControler/usersControler/usersControler");
const avatarUpload = require("../../middleware/fileUpload/avatarUpload");
const checklogin = require("../../middleware/auth/checkLogin");

const usersRoute = express.Router();

usersRoute.get("/user", checklogin, getUser);
usersRoute.post("/search", checklogin, searchUser);
usersRoute.get("/", checklogin, getAllUsers);
usersRoute.get("/:id", checklogin, getUsersById);
usersRoute.post("/", avatarUpload, postUsers);
usersRoute.put("/profile/update/:id", checklogin, avatarUpload, updateUser);
usersRoute.delete("/all", deleteAll);
usersRoute.delete("/:id", checklogin, deleteUser);

module.exports = usersRoute;

const express = require("express");
const {
  getUsersById,
  deleteUser,
  updateUser,
  postUsers,
  deleteAll,
  getAllUsers,
  getUser,
} = require("../../routeControler/usersControler/usersControler");
const avatarUpload = require("../../middleware/fileUpload/avatarUpload");
const checklogin = require("../../middleware/auth/checkLogin");

const usersRoute = express.Router();

usersRoute.get("/user", checklogin, getUser);
usersRoute.get("/", checklogin, getAllUsers);
usersRoute.get("/:id", checklogin, getUsersById);
usersRoute.post("/", avatarUpload, postUsers);
usersRoute.put("/:id", checklogin, updateUser);
usersRoute.delete("/all", deleteAll);
usersRoute.delete("/:id", checklogin, deleteUser);

module.exports = usersRoute;

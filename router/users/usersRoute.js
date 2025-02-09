const express = require("express");
const { getUsers, getUsersById, deleteUser, updateUser, postUsers, deleteAll } = require("../../routeControler/usersControler/usersControler");
const avatarUpload = require("../../middleware/fileUpload/avatarUpload");
const checklogin = require("../../middleware/auth/checkLogin");

const usersRoute = express.Router();

usersRoute.get("/", checklogin, getUsers);
usersRoute.get("/:id", checklogin, getUsersById);
usersRoute.post("/", avatarUpload, postUsers);
usersRoute.put("/:id", checklogin, updateUser);
usersRoute.delete("/all", deleteAll);
usersRoute.delete("/:id", checklogin, deleteUser);

module.exports = usersRoute;

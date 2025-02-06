const express = require("express");
const { getUsers, getUsersById, postUsers, deleteUser, updateUser } = require("../../routeControler/usersControler/usersControler");
const avatarUpload = require("../../middleware/fileUpload/avatarUpload");

const usersRoute = express.Router();

usersRoute.get("/", getUsers);
usersRoute.get("/:id", getUsersById);
usersRoute.post("/", avatarUpload, postUsers);
usersRoute.put("/:id", updateUser);
usersRoute.delete("/:id", deleteUser);

module.exports = usersRoute;

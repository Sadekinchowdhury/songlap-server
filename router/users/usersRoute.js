const express = require("express");
const { getUsers, getUsersById, postUsers, deleteUser, updateUser } = require("../../routeControler/usersControler/usersControler");

const usersRoute = express.Router();

usersRoute.get("/", getUsers);
usersRoute.get("/:id", getUsersById);
usersRoute.post("/", postUsers);
usersRoute.put("/:id", updateUser);
usersRoute.delete("/:id", deleteUser);

module.exports = usersRoute;

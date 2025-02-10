const express = require("express");
const { loginControler, logOutController } = require("../../routeControler/loginControler/loginControler");
const checklogin = require("../../middleware/auth/checkLogin");

const loginRoute = express.Router();

loginRoute.post("/login", loginControler);
loginRoute.delete("/logout", checklogin, logOutController);

module.exports = loginRoute;

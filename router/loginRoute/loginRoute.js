const express = require("express");
const loginControler = require("../../routeControler/loginControler/loginControler");
const loginRoute = express.Router();

loginRoute.post("/", loginControler);

module.exports = loginRoute;

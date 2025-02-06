const express = require("express");
const loginRoute = express.Router();

loginRoute.post("/");

module.exports = loginRoute;

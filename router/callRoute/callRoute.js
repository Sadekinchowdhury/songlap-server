const express = require("express");
const { startNewCall, updateCallStatus, callHistory } = require("../../routeControler/callControler/callControler");
const checklogin = require("../../middleware/auth/checkLogin");

const callRouter = express.Router();

callRouter.post("/",checklogin, startNewCall);
callRouter.put("/status/",checklogin, updateCallStatus);
callRouter.get("/history",checklogin, callHistory);

module.exports = callRouter;

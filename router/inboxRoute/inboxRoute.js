const express = require("express");
const { addConversation } = require("../../routeControler/inboxControler/addConversation");
const checklogin = require("../../middleware/auth/checkLogin");
const { getConversation } = require("../../routeControler/inboxControler/conversation");
const { findConverSation, getMessage, sendMessage } = require("../../routeControler/inboxControler/inboxControler");

const inboxRoute = express.Router();

inboxRoute.get("/conversation", checklogin, getConversation);
inboxRoute.get("/conversation/:id", findConverSation);
inboxRoute.get("/message/:id", getMessage);
inboxRoute.post("/add-conversation", checklogin, addConversation);
inboxRoute.post("/message", sendMessage);
inboxRoute.put("/:id");
inboxRoute.delete("/:id");

module.exports = inboxRoute;

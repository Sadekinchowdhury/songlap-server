const express = require("express");
const { addConversation } = require("../../routeControler/inboxControler/addConversation");
const checklogin = require("../../middleware/auth/checkLogin");
const { getConversation } = require("../../routeControler/inboxControler/conversation");
const inboxRoute = express.Router();

inboxRoute.get("/conversation", checklogin, getConversation);
inboxRoute.get("/:id");
inboxRoute.post("/add-conversation", checklogin, addConversation);
inboxRoute.put("/:id");
inboxRoute.delete("/:id");

module.exports = inboxRoute;

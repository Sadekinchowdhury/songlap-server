const express = require("express");
const { addConversation } = require("../../routeControler/inboxControler/addConversation");
const checklogin = require("../../middleware/auth/checkLogin");
const { getConversation } = require("../../routeControler/inboxControler/conversation");
const {
   findConverSation,
   getMessage,
   sendMessage,
   deleteMessage,
} = require("../../routeControler/inboxControler/inboxControler");
const avatarUpload = require("../../middleware/fileUpload/avatarUpload");

const inboxRoute = express.Router();

inboxRoute.get("/conversation", checklogin, getConversation);
inboxRoute.get("/conversation/:id", findConverSation);
inboxRoute.get("/message/:id", getMessage);
inboxRoute.post("/add-conversation", checklogin, addConversation);
inboxRoute.post("/message", avatarUpload, sendMessage);
inboxRoute.put("/:id");
inboxRoute.delete("/message/delete/", checklogin, deleteMessage);

module.exports = inboxRoute;

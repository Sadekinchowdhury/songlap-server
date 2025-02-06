const express = require("express");
const inboxRoute = express.Router();

inboxRoute.get("/");
inboxRoute.get("/:id");
inboxRoute.post("/");
inboxRoute.put("/:id");
inboxRoute.delete("/:id");

module.exports = inboxRoute;

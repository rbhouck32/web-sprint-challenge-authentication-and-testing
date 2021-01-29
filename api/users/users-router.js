const express = require("express");

const Users = require("./users-model.js");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

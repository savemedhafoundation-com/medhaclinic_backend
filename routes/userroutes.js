const express = require("express");

const router = express.Router();

const { createUser } = require("../controllers/usercontroller");

router.post("/users", createUser);

module.exports = router;

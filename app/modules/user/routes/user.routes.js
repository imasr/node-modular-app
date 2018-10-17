const express = require("express");
const router = express.Router();

const user = require("../../user/controllers/user.controller")

router.post("/register", user.user_register);
router.post("/login", user.user_login);


module.exports = {
    router
};

"use strict";

var _express = require("express");

var _user = require("../../user/controllers/user.controller");

var router = (0, _express.Router)();

router.post("/register", _user.user_register);
router.post("/login", _user.user_login);
router.post("/social", _user.social_login);

module.exports = {
    router: router
};
//# sourceMappingURL=user.routes.js.map
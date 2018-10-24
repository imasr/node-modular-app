"use strict";

var _user = require("../business/user.business");

var _errorHandling = require("../../../helpers/errorHandling.helper");

// register a new user
var user_register = async function user_register(req, res) {
    try {
        var result = await (0, _user.registration)(req.body);
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send((0, _errorHandling.errorHandler)(e));
    };
};

// login an existing user and generate refresh jwt token
var user_login = async function user_login(req, res) {
    try {
        var result = await (0, _user.login)(req.body);
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send((0, _errorHandling.errorHandler)(e));
    }
};

// login user with social account and generate refresh jwt token
var social_login = async function social_login(req, res) {
    try {
        var result = await (0, _user.sociallogin)(req.body);
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send((0, _errorHandling.errorHandler)(e));
    }
};

module.exports = {
    user_register: user_register,
    user_login: user_login,
    social_login: social_login
};
//# sourceMappingURL=user.controller.js.map
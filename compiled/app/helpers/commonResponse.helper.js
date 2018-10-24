"use strict";

var _pickResponse = require("./pickResponse.helper");

var _generate = require("./../util/generate.token");

var _messages = require("../../config/messages");

exports.socialloginResonse = async function (data) {
    return {
        result: (0, _pickResponse.pickSociailAccountCredentials)(data),
        status: 200,
        token: await (0, _generate.generateAuthToken)(data),
        message: _messages.msg.loggedIn
    };
};
//# sourceMappingURL=commonResponse.helper.js.map
"use strict";

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// for generating jwt auth token

exports.generateAuthToken = function (user) {
    return new Promise(function (resolve, reject) {
        var token = _jsonwebtoken2.default.sign({ _id: user._id.toString() }, process.env.secret_token).toString();
        resolve(token);
    });
};
//# sourceMappingURL=generate.token.js.map
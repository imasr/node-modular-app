"use strict";

var _passwordValidator = require("password-validator");

var _passwordValidator2 = _interopRequireDefault(_passwordValidator);

var _messages = require("../../../../config/messages");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _passwordValidator2.default();
schema.is().min(8) // Minimum length 8
.has().uppercase() // Must have uppercase letters
.has().lowercase() // Must have lowercase letters
.has().digits() // Must have digits
.has().symbols(); // Must have special character

var password_validator = async function password_validator(password) {
    return await new Promise(function (resolve, reject) {
        if (!password) {
            reject(_messages.msg.invalidPassword);
        }
        var validate = schema.validate(password);
        resolve(validate);
    });
};
module.exports = {
    password_validator: password_validator
};
//# sourceMappingURL=validation.business.js.map
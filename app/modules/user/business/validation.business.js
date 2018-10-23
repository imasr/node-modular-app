var passwordValidator = require('password-validator');
const message = require("../../../../config/messages").msg;

var schema = new passwordValidator();
schema.is().min(8) // Minimum length 8
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().symbols(); // Must have special character

exports.password_validator = async password => {
    return await new Promise(function (resolve, reject) {
        if (!password) {
            reject(message.invalidPassword);
        }
        let validate = schema.validate(password);
        resolve(validate);
    });
};

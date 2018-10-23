import passwordValidator from 'password-validator';
import { msg as message } from "../../../../config/messages";

var schema = new passwordValidator();
schema.is().min(8) // Minimum length 8
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().symbols(); // Must have special character

const password_validator = async (password) => {
    return await new Promise(function (resolve, reject) {
        if (!password) {
            reject(message.invalidPassword);
        }
        let validate = schema.validate(password);
        resolve(validate);
    });
}
module.exports = {
    password_validator
}

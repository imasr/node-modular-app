var passwordValidator = require("password-validator");
var password_validation = new passwordValidator();
password_validation
    .is()
    .min(8) // Minimum length 8
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .symbols(); // Must have special character

exports.password_validator = password => {
    return new Promise(function (resolve, reject) {
        let validate = password_validation.validate(password);
        resolve(validate);
    });
};


var passwordValidator = require("password-validator");
var password_validation = new passwordValidator();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
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

exports.phone_validator = (phone, social = false) => {
  let validate;
  return new Promise(function (resolve, reject) {
    if (phone) {
      let number = phoneUtil.parse(phone, "");
      let countryCode = number.getCountryCode()
      let parsedNum = number.getNationalNumber()
      let temp = `+${countryCode}${parsedNum}`
      if (temp != phone) {
        resolve(false)
      }
      else {
        let regionCode = phoneUtil.getRegionCodeForCountryCode(countryCode)
        let exampleNumber = phoneUtil.getExampleNumber(regionCode);
        exampleNumber = exampleNumber.values_[2].toString()
        let maxLength = exampleNumber.length
        parsedNum = parsedNum.toString()
        if (maxLength !== parsedNum.length) {
          resolve(false)
        }
        else {
          validate = phoneUtil.isValidNumber(number)
        }
        if (social) {
          let response = {
            valid: validate,
            countryCode: countryCode,
            phoneNo: parsedNum
          };
          resolve(response)
        }
        else {
          resolve(validate)
        }
      }
    }
  });
};

const _ = require("lodash"),
  { User } = require("../models/user.model"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  { phone_validator } = require("./validation.business"),
  { pickUserProfileResponse } = require("../../../helpers/pickResponse.helper");

exports.updateUser = function (user) {
  return new Promise(function (resolve, reject) {
    var query = { _id: user._id };
    User.update(query, { $set: user }).then(
      function (user) {
        resolve(user);
      },
      function (err) {
        reject(err);
      }
    );
  });
};

exports.updateUserDetails = data => {
  const userId = data.user._id;
  const userDetails = pickUserProfileResponse(data.body);
  delete userDetails.id;
  const message = data.msg;
  let phone;
  if (userDetails.phone && userDetails.countryCode) {
    phone = `${userDetails.countryCode}${userDetails.phone}`;
  }
  return phone_validator(phone)
    .then(value => {
      if (!value) {
        throw message.invalidPhone;
      }
      if (userDetails.email) {
        userDetails.isEmailVerified = false;
      }
      if (userDetails.phone) {
        userDetails.isPhoneVerified = false;
      }
      return User.findByIdAndUpdate(
        { _id: userId },
        { $set: userDetails },
        { safe: true, new: true, overwrite: true }
      ).then(user => {
        return {
          result: pickUserProfileResponse(user),
          status: 200,
          message: message.success
        };
      });
    })
    .catch(e => {
      throw errorHandler(e);
    });
};
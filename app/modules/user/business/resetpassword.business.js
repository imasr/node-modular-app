const moment = require("moment"),
  message = require("../../../../config/messages").msg,
  validateInput = require("../business/validation.business"),
  crypto = require("../../../utility/crypto"),
  config = require("../../../../config/config"),
  { User } = require("../models/user.model"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  { pickResetPasswordResult } = require("../../../helpers/pickResponse.helper");

exports.resetpassword = data => {
  return validateInput
    .password_validator(data.password)
    .then(result => {
      if (!result) {
        throw message.invalidPassword;
      }
      if (!data.resetToken) {
        throw message.invalidRequest;
      }
      data.resetToken = decodeURIComponent(data.resetToken);
      let token_time = crypto.decryption(data.resetToken);
      if (token_time.length == 0 || token_time == "" || token_time == NaN) {
        throw errorHandler(message.invalidResetToken, 410);
      }
      token_time = parseInt(token_time);
      let current_time = Date.now();
      let a = moment(token_time);
      var b = moment(current_time);
      if (b.diff(a, "hours") >= config.reminderTime) {
        throw errorHandler(message.expiredResetToken, 410);
      }
      return User.findOneAndUpdate(
        {
          resetToken: data.resetToken
        },
        {
          $set: {
            password: data.password,
            resetToken: null
          }
        },
        { new: true }
      ).then(user => {
        if (!user) {
          throw errorHandler(message.invalidResetToken, 410);
        }
        return {
          result: pickResetPasswordResult(user),
          status: 200,
          message: message.passwordReset
        };
      });
    })
    .catch(e => {
      if (e.status) {
        throw e;
      } else {
        throw errorHandler(e);
      }
    });
};
const moment = require("moment"),
  message = require("../../../../config/messages").msg,
  crypto = require("../../../utility/crypto"),
  config = require("../../../../config/config"),
  { User } = require("../models/user.model"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  { pickVerifyResponse } = require("../../../helpers/pickResponse.helper");

exports.verifyToken = data => {
  return new Promise((resolve, reject) => {
    if (!data.token) {
      reject(errorHandler(message.invalidRequest));
    }
    data.token = decodeURIComponent(data.token);
    let token_time = crypto.decryption(data.token);
    if (token_time.length == 0 || token_time == "" || token_time == NaN) {
      reject(errorHandler(message.invalidToken, 410));
    } else {
      return User.findOne({ emailVerifyToken: data.token })
        .then(user => {
          if (!user) {
            reject(errorHandler(message.invalidToken, 410));
          }
          if (user.isEmailVerified == true) {
            reject(errorHandler(message.activatedAccount));
          } else {
            token_time = parseInt(token_time);
            let current_time = Date.now();
            let a = moment(token_time);
            var b = moment(current_time);
            if (b.diff(a, "hours") >= config.reminderTime) {
              reject(errorHandler(message.expiredLink, 410));
            } else {
              user.isEmailVerified = true;
              return User.update(
                { emailVerifyToken: data.token },
                { $set: user },
                { new: true }
              ).then(data => {
                user = pickVerifyResponse(user);
                resolve({
                  result: user,
                  status: 200,
                  message: message.emailVerified
                });
              });
            }
          }
        })
        .catch(e => {
          reject(errorHandler(e));
        });
    }
  });
};

exports.verifyotp = data => {

  let setObj, findObj
  return new Promise((resolve, reject) => {
    if (!data.otp || !data.id) {

      reject(errorHandler(message.invalidRequest))
    }
    else if (data.otp.length == 4) {
      msg = message.phoneVerified
      findObj = {
        _id: data.id, otp: data.otp
      }
      setObj = {
        isPhoneVerified: true,
        otp: null
      };
    }
    else if (data.otp.length == 6) {
      msg = message.emailVerified
      findObj = {
        _id: data.id, emailVerifyCode: data.otp
      }
      setObj = {
        isEmailVerified: true,
        emailVerifyCode: null
      };
    }
    else {
      reject(errorHandler(message.invalidToken))
    }

    return User.findOneAndUpdate(
      findObj,
      { $set: setObj },
      { new: true }
    )
      .then(user => {
        if (!user) {
          throw message.invalidToken;
        }
        user = pickVerifyResponse(user);
        resolve({
          result: user,
          status: 200,
          message: msg
        })
      })
      .catch(e => {

        reject(errorHandler(e))
      });
  })
};
const _ = require("lodash"),
  message = require("../../../../config/messages").msg,
  validateInput = require("../business/validation.business"),
  { User } = require("../models/user.model"),
  config = require("../../../../config/config"),
  cryptoJs = require("crypto-js"),
  sendgrid = require("../../../utility/sendmail"),
  aws_sms = require("../../../utility/sendsms"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  {
    pickUserResponseWithToken
  } = require("../../../helpers/pickResponse.helper");

exports.forgotpassword = data => {
  var body = data;
  var resetToken = createResetToken();
  body.resetToken = resetToken;
  let setObj, findObj, flag;
  return new Promise((resolve, reject) => {
    if (body.email) {
      findObj = {
        email: body.email
      };
      setObj = {
        resetToken: body.resetToken
      };
      flag = 0;
    } else {
      findObj = {
        phone: body.phone
      };
      setObj = {
        resetToken: body.resetToken
      };
      flag = 1;
    }
    return User.findOneAndUpdate(findObj, {
      $set: setObj
    })
      .then(user => {
        if (!user) {
          reject(errorHandler(message.userNotFound));
        } else if (
          (!user.isEmailVerified && user.emailVerifyToken == null) ||
          (!user.isEmailVerified && user.emailVerifyCode == null)
        ) {
          reject(errorHandler(message.emailNotVerified));
        } else if (
          (!user.isEmailVerified && user.emailVerifyToken != null) ||
          (!user.isEmailVerified && user.emailVerifyCode != null)
        ) {
          reject(errorHandler(message.notActivated));
        } else {
          user.resetToken = body.resetToken;
          sendResetToken(user, flag);
          user = pickUserResponseWithToken(user);
          resolve({
            result: user,
            status: 200,
            message: message.resetPassLink
          });
        }
      })
      .catch(e => {
        throw errorHandler(e);
      });
  });
};

function createResetToken() {
  let datetime = Date.now();
  let resetToken = cryptoJs.AES.encrypt(
    datetime.toString(),
    config.aes256secret
  );
  return resetToken.toString();
}

function sendResetToken(data, flag) {
  var res = `Your reset password token is ${data.resetToken} `;
  if (flag == 0) {
    sendgrid.sendmail(
      data.email,
      encodeURIComponent(data.resetToken),
      data.firstName,
      "forgotPassword"
    );
  } else {
    aws_sms.sendsms(data.phone, res);
  }
}

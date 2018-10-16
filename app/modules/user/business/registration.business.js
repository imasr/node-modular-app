const message = require("../../../../config/messages").msg,
  validateInput = require("../business/validation.business"),
  { User } = require("../models/user.model"),
  {
    UserContact
  } = require("../../../modules/userContacts/models/userContact.model"),
  config = require("../../../../config/config"),
  cryptoJs = require("crypto-js"),
  sendgrid = require("../../../utility/sendmail"),
  twilio = require("../../../utility/sendsms"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  {
    pickUserCredentials,
    pickUserVerificationDetails
  } = require("../../../helpers/pickProperties.helper"),
  {
    pickUserResponse,
    pickUserProfileResponse,
    pickGetUserResult,
    pickRegistrationResponse,
    pickSearchUserResult
  } = require("../../../helpers/pickResponse.helper"),
  _ = require("lodash");

exports.registration = data => {
  return validateInput
    .password_validator(data.password)
    .then(result => {
      if (!result) {
        throw message.invalidPassword;
      }
      if (!data.countryCode) {
        throw message.countryCode;
      }
      let phone = `${data.countryCode}${data.phone}`;
      return validateInput.phone_validator(phone).then(value => {
        if (!value) {
          throw message.invalidPhone;
        }
        if (!data.acceptTerms) {
          throw message.acceptTerms;
        }
        var user = new User(data);
        return user.save().then(user => {
          return user.generateAuthToken().then(token => {
            return {
              result: pickRegistrationResponse(user),
              token: token,
              status: 200,
              message: message.userRegistered
            };
          });
        });
      });
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

exports.user_verification = data => {
  if (!data.phone && !data.id && !data.email && !data.isVerifiedBy) {
    throw message.invalidRequest;
  }
  let token = cryptoJs.AES.encrypt(Date.now().toString(), config.aes256secret);
  data.emailVerifyToken = token.toString();
  data.otp = Math.floor(1000 + Math.random() * 9000);
  data.emailVerifyCode = Math.floor(100000 + Math.random() * 900000);
  let setObj = pickUserVerificationDetails(data);
  return User.findOneAndUpdate(
    {
      _id: data.id
    },
    {
      $set: setObj
    },
    {
      new: true
    }
  )
    .then(user => {
      if (!user) {
        throw message.userNotFound;
      }
      user.isVerifiedBy = data.isVerifiedBy;
      SendVerification(user);
      return {
        result: user.id,
        status: 200,
        message: message.verificationRequest
      };
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

exports.user_login = data => {
  var body = pickUserCredentials(data);

  return User.findByCredentials(body.email, body.password)
    .then(user => {
      if (!user) {
        throw message.userNotFound;
      }
      return user.generateAuthToken().then(token => {
        return {
          result: pickUserProfileResponse(user),
          status: 200,
          token: token,
          message: message.loggedIn
        };
      });
    })
    .catch(e => {
      throw errorHandler(message.invalidCredentials);
    });
};

exports.getUsers = req => {
  return new Promise((resolve, reject) => {
    let query;
    if (!req.params.id && !req.query.getAllUsers) {
      reject(errorHandler(message.invalidRequest));
    } else {
      if (req.params.id) {
        query = { _id: req.params.id };
      } else if (!req.query.getAllUsers) {
        query = {};
      }
      return User.find(query)
        .then(users => {
          if (users.length == 0) {
            reject(errorHandler(message.userNotFound));
          }
          resolve({
            result: pickGetUserResult(users),
            status: 200,
            message: message.success
          });
        })
        .catch(e => {
          reject(errorHandler(e));
        });
    }
  });
};

exports.deleteUser = req => {
  return User.findOne({
    _id: req.params.id
  })
    .then(user => {
      if (!user) throw message.userNotFound;
      return user.remove().then(data => {
        return {
          result: user,
          status: 200,
          message: message.userRemoved
        };
      });
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

exports.deviceToken = req => {
  let userId = req.user._id.toString();
  let set = {
    deviceType: req.device.type,
    browserInfo: req.headers["user-agent"],
    deviceToken: req.body.deviceToken
  };
  return User.findOneAndUpdate(
    {
      _id: userId
    },
    {
      $push: {
        deviceInfo: set
      }
    },
    {
      safe: true,
      new: true
    }
  )
    .then(user => {
      if (!user) {
        throw req.msg.userNotFound;
      }
      let res = pickUserResponse(user);
      return {
        result: res,
        status: 200,
        message: req.msg.success
      };
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

exports.searchUser = req => {
  let searchQuery = {
    $regex: req.query.searchText,
    $options: "i"
  };

  return User.find({
    $or: [
      { firstName: searchQuery },
      { lastName: searchQuery },
      { email: searchQuery }
    ]
  })
    .then(users => {
      let usersArr = users.reduce((a, o) => {
        if (req.user.id !== o.id) {
          o.contactId = o.id;
          o.requestStatus = 0;
          a.push(o);
        }
        return a;
      }, []);

      return UserContact.find({ userId: req.user._id }).then(userContact => {
        let contactsArr = [];
        userContact.map(uc => {
          uc.contacts.map(cu => {
            if (cu.requestStatus == 3) {
              contactsArr.push(cu);
            }
            usersArr.map(u => {
              if (u.contactId == cu.contactId) {
                u.requestStatus = cu.requestStatus;
              }
            });
          });
        });
        var result = _(usersArr)
          .differenceBy(contactsArr, "contactId", "firstName")
          .value();
        return {
          result: pickSearchUserResult(result),
          status: 200,
          message: message.success
        };
      });
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

function SendVerification(data) {
  var message = `Your phone number verification token is ${data.otp} `;
  if (data.countryCode) {
    if (data.phone.indexOf("+") === -1) {
      data.phone = data.countryCode + data.phone;
    }
  }
  switch (data.isVerifiedBy) {
    case 1:
      sendgrid.sendmail(
        data.email,
        encodeURIComponent(data.emailVerifyToken),
        data.firstName,
        "emailVerify",
        null,
        data.emailVerifyCode
      );
      break;
    case 2:
      twilio.sendsms(data.phone, message);
      break;
    default:
      sendgrid.sendmail(
        data.email,
        encodeURIComponent(data.emailVerifyToken),
        data.firstName,
        "emailVerify",
        null,
        data.emailVerifyCode
      );
      twilio.sendsms(data.phone, message);
  }
}

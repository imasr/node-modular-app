const _ = require("lodash"),
  message = require("../../../../config/messages").msg,
  { User } = require("../models/user.model"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  validateInput = require("../business/validation.business"),
  {
    pickUserProfileResponse,
    pickUserResponse
  } = require("../../../helpers/pickResponse.helper");
var response;
exports.socialRegistration = data => {
  let phone = data.socialData.user.phoneNumber;
  return validateInput
    .phone_validator(phone, true)
    .then(response => {
      if (!response.valid) {
        throw message.invalidPhone;
      }
      let userDetails = data.socialData.user;
      let userCredentials = {
        credentials: data.socialData.credential,
        uid: userDetails.uid,
        additionalInfo: userDetails.stsTokenManager
      };
      var str = userDetails.displayName;
      var arr = str.split(/(\s+)/);
      let userObj = {
        firstName: arr[0],
        lastName: arr[2],
        email: userDetails.email,
        phone: response.phoneNo,
        countryCode: response.countryCode,
        avatar: userDetails.photoUrl,
        isEmailVerified: true,
        acceptTerms: data.acceptTerms
      };
      if (data.isFacebook) {
        userObj.isFacebook = true;
        userObj.facebookData = userCredentials;
      } else if (data.isGoogle) {
        userObj.isGoogle = true;
        userObj.googleData = userCredentials;
      }
      var user = new User(userObj);
      return user.save().then(user => {
        return user.generateAuthToken().then(token => {
          response = pickUserResponse(user);
          return {
            result: response,
            token: token,
            status: 200,
            message: message.userRegistered
          };
        });
      });
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

exports.socialLogin = data => {
  if (data.isGoogle) {
    query = {
      email: data.email,
      "googleData.uid": data.uid
    };
  } else if (data.isFacebook) {
    query = {
      email: data.email,
      "facebookData.uid": data.uid
    };
  }
  return User.findOne(query)
    .then(user => {
      if (!user) {
        throw message.userNotFound;
      }
      return user.generateAuthToken().then(token => {
        response = pickUserProfileResponse(user);
        return {
          result: response,
          token: token,
          status: 200,
          message: "Succesfully Logged in User"
        };
      });
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

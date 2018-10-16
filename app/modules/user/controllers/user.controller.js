const registration = require("../business/registration.business");
const socialSignOn = require("../business/socialsignon.business");
const update = require("../business/updateuser.business");
const avatar = require("../business/useravatar.business");
const status = require("../business/status.business");

const { controllerFunction } = require("../../../helpers/controller.helper");

// register a new user
exports.user_register = (req, res) => {
  return controllerFunction(registration.registration, res, req.body);
};

exports.user_verification = (req, res) => {
  return controllerFunction(registration.user_verification, res, req.body);
};

// login an existing user and generate refresh jwt token
exports.user_login = (req, res) => {
  return controllerFunction(registration.user_login, res, req.body);
};

exports.getUsers = (req, res) => {
  return controllerFunction(registration.getUsers, res, req);
};

exports.deleteUsers = (req, res) => {
  return controllerFunction(registration.deleteUser, res, req);
};

exports.deviceToken = (req, res) => {
  return controllerFunction(registration.deviceToken, res, req);
};

exports.updateUser = (req, res) => {
  return controllerFunction(update.updateUserDetails, res, req);
};

exports.socialSignUp = (req, res) => {
  return controllerFunction(socialSignOn.socialRegistration, res, req.body);
};

exports.socialSignIn = (req, res) => {
  return controllerFunction(socialSignOn.socialLogin, res, req.body);
};

exports.uploadAvatar = (req, res) => {
  return controllerFunction(avatar.uploadFileSignedUrl, res, req);
};

exports.onlineStatus = (req, res) => {
  return controllerFunction(status.setOnlineStatus, res, req);
};

exports.userSearch = (req, res) => {
  return controllerFunction(registration.searchUser, res, req);
};

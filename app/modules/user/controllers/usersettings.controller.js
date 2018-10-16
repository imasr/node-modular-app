const business = require("../business/usersettings.business");

const { controllerFunction } = require("../../../helpers/controller.helper");

exports.getUserSettings = (req, res) => {
  return controllerFunction(business.getUserSettings, res, req);
};

exports.setSMSNotifications = (req, res) => {
  return controllerFunction(business.setSMSNotifications, res, req);
};

exports.setEmailNotifications = (req, res) => {
  return controllerFunction(business.setEmailNotifications, res, req);
};

exports.setPushNotifications = (req, res) => {
  return controllerFunction(business.setPushNotifications, res, req);
};

exports.changeLanguage = (req, res) => {
  return controllerFunction(business.changeLanguage, res, req);
};
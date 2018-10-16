const business = require("../business/verify.business");

const { controllerFunction } = require("../../../helpers/controller.helper");

exports.verifyotp = (req, res) => {
  return controllerFunction(business.verifyotp, res, req.body);
};

exports.verifyEmail = (req, res) => {
  return controllerFunction(business.verifyToken, res, req.body);
};
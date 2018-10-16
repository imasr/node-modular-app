const business = require("../business/forgotpassword.business");

const { controllerFunction } = require("../../../helpers/controller.helper");

exports.user_forgot_password = (req, res) => {
  return controllerFunction(business.forgotpassword, res, req.body);
};

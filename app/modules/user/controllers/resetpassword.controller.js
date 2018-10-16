const business = require("../business/resetpassword.business");

const { controllerFunction } = require("../../../helpers/controller.helper");

exports.user_reset_password = (req, res) => {
  return controllerFunction(business.resetpassword, res, req.body);
};
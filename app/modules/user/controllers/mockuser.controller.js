const business = require("../business/mockuser.business");

const { controllerFunction } = require("../../../helpers/controller.helper");

exports.mock_user = (req, res) => {
  return controllerFunction(business.mockuser, res, req.body);
};

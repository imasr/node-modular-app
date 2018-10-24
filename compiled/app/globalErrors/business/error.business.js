"use strict";

var _require = require("../models/error.model"),
    Error = _require.Error;

var message = require("../../../config/messages").msg;
var sendgrid = require("../../utility/sendmail");
var mailerList = require("../../../config/config").mailerList;
exports.registerError = function (err) {
  var error = new Error({
    name: err.name,
    description: err.stack
  });
  error.save().then(function (a) {
    process.stderr.write(a.description);
    mailerList.map(function (user, i) {
      sendgrid.sendmail(user.email, null, user.name, "error", a.description);
    });

    process.exitCode = 1;
  }).catch(function (e) {
    process.exitCode = 1;
  });
};
//# sourceMappingURL=error.business.js.map
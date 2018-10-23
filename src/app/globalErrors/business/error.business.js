const { Error } = require("../models/error.model");
const message = require("../../../config/messages").msg;
const sendgrid = require("../../utility/sendmail");
const mailerList = require("../../../config/config").mailerList;
exports.registerError = err => {
  var error = new Error({
    name: err.name,
    description: err.stack
  });
  error
    .save()
    .then(a => {
      process.stderr.write(a.description);
      mailerList.map((user, i) => {
        sendgrid.sendmail(user.email, null, user.name, "error", a.description);
      });

      process.exitCode = 1;
    })
    .catch(e => {
      process.exitCode = 1;
    });
};

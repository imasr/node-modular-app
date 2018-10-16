const _ = require("lodash"),
  validateInput = require("../business/validation.business"),
  { User } = require("../models/user.model"),
  config = require("../../../../config/config"),
  cryptoJs = require("crypto-js"),
  sendgrid = require("../../../utility/sendmail"),
  twilio = require("../../../utility/sendsms"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  { pickUserResponse } = require("../../../helpers/pickResponse.helper"),
  gcloud = require("../../../utility/gcloudstorage.js");

exports.uploadFileSignedUrl = req => {
  let userId = req.user._id.toString();
  const message = req.msg;
  let action;
  action = "write";
  let options = {
    action: action,
    expires: "03-17-2025",
    contentType: req.body.contentType,
    extensionHeaders: {
      "x-goog-user-id": userId
    }
  };
  return gcloud
    .signedUrl(options, userId)
    .then(uploadUrl => {
      options.action = "read";
      return gcloud.signedUrl(options, userId).then(getUrl => {
        return User.findOneAndUpdate(
          { _id: userId },
          { $set: { avatar: getUrl } },
          { new: true }
        ).then(user => {
          if (!user) {
            throw message.userNotFound;
          }
          return {
            result: { uploadUrl: uploadUrl, getUrl: getUrl },
            status: 200,
            message: message.success
          };
        });
      });
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

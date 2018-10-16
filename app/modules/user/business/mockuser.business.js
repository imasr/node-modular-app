const message = require("../../../../config/messages").msg,
  validateInput = require("../business/validation.business"),
  { User } = require("../models/user.model"),
  config = require("../../../../config/config"),
  cryptoJs = require("crypto-js"),
  sendgrid = require("../../../utility/sendmail"),
  aws_sms = require("../../../utility/sendsms"),
  fakedata = require("../../../utility/faker"),
  { Company } = require("../../company/models/company.model"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  { pickUserResponse } = require("../../../helpers/pickResponse.helper"),
  { pickMockuserCompanyDetails } = require("../../../helpers/pickProperties.helper");

exports.mockuser = function (data) {
  return new Promise((resolve, reject) => {
    if (data.mockEmployee) {
      return fakedata
        .createMockData(data)
        .then(res => {
          return Company.findById(data.companyId).then(result => {
            if (!result) {
              reject(errorHandler(message.invalidCompany));
            }
            let response = pickMockuserCompanyDetails(result._doc);
            res.map((val, i) => {
              val.company = response;
            });
            return User.insertMany(res).then(user => {
              sendVerification(user);

              let resArr = [];
              user.map((resp, i) => {

                resArr[i] = pickUserResponse(resp)
              })
              resolve({ result: resArr, status: 200, message: message.success });
            });
          });
        })
        .catch(e => {

          reject(errorHandler(e));
        });
    } else {
      reject(errorHandler(message.validationError));
    }
  });
};

function sendVerification(data) {
  data.map(user => {
    let subject;
    if (user.company.multitenant == true) {
      subject = "multitenantActivation";
    } else {
      subject = "cloudActivation";
    }
    sendgrid.sendmail(
      user.email,
      encodeURIComponent(user.emailVerifyToken),
      user.firstName,
      subject,
      user.company.name
    );
  });
}

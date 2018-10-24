"use strict";

var _ = require("lodash");

exports.pickUserProfileResponse = function (data) {
    var response = _.pick(data, ["_id", "name", "email", "phone"]);
    return response;
};
exports.pickRegistrationData = function (data) {
    var response = _.pick(data, ["name", "email", "phone", "password", "acceptTerms"]);
    return response;
};
exports.pickRegistrationResponse = function (data) {
    var response = _.pick(data, ["_id", "name", "email", "phone", "token"]);
    return response;
};

exports.pickUserCredentials = function (data) {
    return _.pick(data, ["email", "password"]);
};

exports.pickSociailAccountCredentials = function (data) {
    return _.pick(data, ["name", "email", "phone", "isGoogle", "googleData", "isFacebook", "facebookData", "isLinkedln", "linkedlnData", "isTwitter", "twitterData"]);
};
//# sourceMappingURL=pickResponse.helper.js.map
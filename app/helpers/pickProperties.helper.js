const _ = require("lodash");

exports.pickUserCredentials = data => {
  return _.pick(data, ["email", "password"]);
};

exports.pickContactDetails = data => {
  return _.pick(data, ["firstName", "lastName", "email"]);
};

exports.pickUserDetails = data => {
  return _.pick(data, [
    "firstName",
    "lastName",
    "email",
    "avatar",
    "location",
    "phone",
    "countryCode",
    "userStatus"
  ]);
};

exports.pickContactDetails = data => {
  return _.pick(data, [
    "firstName",
    "lastName",
    "email",
    "avatar",
    "location",
    "phone",
    "countryCode",
    "userStatus"
  ]);
};

exports.pickUserVerificationDetails = data => {
  return _.pick(data, ["emailVerifyToken", "otp", "emailVerifyCode"]);
};

exports.pickMockuserCompanyDetails = data => {
  return _.pick(data, ["_id", "name", "multitenant"]);
};

exports.pickEntLncActivationDetails = data => {
  return _.pick(data, ["id", "password", "acceptTerms"]);
};

exports.pickOnlineStatus = data => {
  return _.pick(data, ["onlineStatus"]);
};

exports.pickEmailNotificationsProperties = data => {
  let object = _.pick(data, [
    "global",
    "reminder",
    "feedback",
    "product",
    "news"
  ]);
  return _.pickBy(object, _.isBoolean);
};

exports.pickPushNotificationsProperties = data => {
  return _.pick(data, ["global", "contacts", "messaging", "cargoFeeds"]);
};

exports.pickPushNotificationsContactsProperties = data => {
  let object = _.pick(data, ["global", "request", "accept"]);
  return _.pickBy(object, _.isBoolean);
};

exports.pickPushNotificationsMessagingProperties = data => {
  let object = _.pick(data, ["global", "room", "media"]);
  return _.pickBy(object, _.isBoolean);
};

exports.pickPushNotificationsCargoFeedsProperties = data => {
  let object = _.pick(data, ["global", "assets", "tags"]);
  return _.pickBy(object, _.isBoolean);
};

exports.pickMessageProperties = data => {
  return _.pick(data, [
    "conversationId",
    "content",
    "senderId",
    "createdAt",
    "updatedAt"
  ]);
};

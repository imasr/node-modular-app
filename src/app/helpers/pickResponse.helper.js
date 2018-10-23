const _ = require("lodash");

exports.pickUserProfileResponse = data => {
    let response = _.pick(data, [
        "_id",
        "name",
        "email",
        "phone",
    ]);
    return response;
};

exports.pickRegistrationResponse = data => {
    var response = _.pick(data, [
        "_id",
        "name",
        "email",
        "phone",
        "token"
    ]);
    return response;
};

exports.pickUserCredentials = data => {
    return _.pick(data, ["email", "password"]);
};

exports.pickSociailAccountCredentials = data => {
    return _.pick(data, [
        "name",
        "email",
        "isGoogle",
        "googleData",
        "isFacebook",
        "facebookData",
        "isLinkedln",
        "linkedlnData",
        "isTwitter",
        "twitterData"
    ]);
};

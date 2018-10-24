"use strict";

var _messages = require("../../../../config/messages");

var _validation = require("./validation.business");

var _user = require("../models/user.model");

var _pickResponse = require("../../../helpers/pickResponse.helper");

var _bcrypt = require("bcrypt");

var _generate = require("../../../util/generate.token");

var _commonResponse = require("../../../helpers/commonResponse.helper");

// registration
var registration = async function registration(data) {
    var body = (0, _pickResponse.pickRegistrationData)(data);

    var userExist = await _user.User.findOne({ email: body.email });
    if (userExist) {
        throw _messages.msg.duplicateEmail;
    }
    var validatePasssword = await (0, _validation.password_validator)(body.password);
    if (!validatePasssword) {
        throw _messages.msg.invalidPassword;
    }
    if (!body.acceptTerms) {
        throw _messages.msg.acceptTerms;
    }
    if (!body.name) {
        throw _messages.msg.userRequired;
    }
    var user = new _user.User(body);
    var response = await user.save();
    if (response) return {
        result: (0, _pickResponse.pickRegistrationResponse)(response),
        status: 200,
        message: _messages.msg.userRegistered
    };
};

// login
var login = async function login(data) {
    var body = (0, _pickResponse.pickUserCredentials)(data);

    var user = await _user.User.findOne({ email: body.email });
    if (!user) {
        throw _messages.msg.userNotFound;
    }
    if (!user.password) {
        throw _messages.msg.passworNotSet;
    }
    var verifiedPassword = await (0, _bcrypt.compare)(body.password, user.password);

    if (!verifiedPassword) {
        throw _messages.msg.invalidCredentials;
    } else {
        return {
            result: (0, _pickResponse.pickUserProfileResponse)(user),
            status: 200,
            token: await (0, _generate.generateAuthToken)(user),
            message: _messages.msg.loggedIn
        };
    }
};

//social login
var sociallogin = async function sociallogin(data) {
    var body = (0, _pickResponse.pickSociailAccountCredentials)(data);
    if (body.isGoogle) {
        body['googleData'] = {
            id: data.id
        };
    } else if (body.isFacebook) {
        body['facebookData'] = {
            id: data.id
        };
    } else if (body.isLinkedln) {
        body['linkedlnData'] = {
            id: data.id
        };
    } else if (body.isTwitter) {
        body['twitterData'] = {
            id: data.id
        };
    } else {
        throw _messages.msg.invalidUser;
    }
    var userExist = await _user.User.findOne({ email: body.email });
    if (!userExist) {
        var user = new _user.User(body);
        var registerUser = await user.save();
        if (registerUser) {
            return await (0, _commonResponse.socialloginResonse)(registerUser);
        }
    } else if (body.isGoogle && userExist.isGoogle || body.isTwitter && userExist.isTwitter || body.isFacebook && userExist.isFacebook || body.isLinkedln && userExist.isLinkedln) {
        return await (0, _commonResponse.socialloginResonse)(userExist);
    } else {
        var loggedUser = await _user.User.findByIdAndUpdate(userExist._id, { $set: body }, { new: true });
        if (loggedUser) {
            return await (0, _commonResponse.socialloginResonse)(loggedUser);
        }
    }
};

module.exports = {
    registration: registration,
    login: login,
    sociallogin: sociallogin
};
//# sourceMappingURL=user.business.js.map
const message = require("../../../../config/messages").msg;
const validateInput = require("./validation.business");
const { User } = require("../models/user.model");
const { errorHandler } = require("../../../helpers/errorHandling.helper");
const { pickUserCredentials } = require("../../../helpers/pickProperties.helper");
const { pickUserProfileResponse, pickRegistrationResponse } = require("../../../helpers/pickResponse.helper");
const _ = require("lodash");
const bcrypt = require("bcrypt");

exports.registration = async data => {

    let validatePasssword = await validateInput.password_validator(data.password)
    if (!validatePasssword) {
        throw message.invalidPassword
    }
    if (!data.acceptTerms) {
        throw message.acceptTerms
    }
    if (!data.name) {
        throw message.userRequired
    }
    let user = new User(data);
    let savedData = await user.save()
    if (savedData)
        return {
            result: pickRegistrationResponse(savedData),
            status: 200,
            message: message.userRegistered
        };
};

exports.login = async data => {
    var body = pickUserCredentials(data);
    let user = await User.findOne({ email: body.email })
    if (!user) {
        throw message.userNotFound;
    }
    let verifiedPassword = await bcrypt.compare(body.password, user.password)
    if (verifiedPassword) {
        let token = await user.generateAuthToken()
        if (token)
            return {
                result: pickUserProfileResponse(user),
                status: 200,
                token: token.token,
                message: message.loggedIn
            };
    } else {
        throw message.invalidCredentials
    }
};
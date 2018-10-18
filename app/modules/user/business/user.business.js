const message = require("../../../../config/messages").msg;
const validateInput = require("./validation.business");
const { User } = require("../models/user.model");
const { errorHandler } = require("../../../helpers/errorHandling.helper");
const { pickUserCredentials } = require("../../../helpers/pickProperties.helper");
const { pickUserProfileResponse, pickRegistrationResponse } = require("../../../helpers/pickResponse.helper");
const _ = require("lodash");
const bcrypt = require("bcrypt");

exports.registration = data => {
    return validateInput.password_validator(data.password).then(result => {
        if (!result) {
            throw message.invalidPassword
        }
        let user = new User(data);
        return user.save().then(response => {
            return {
                result: pickRegistrationResponse(response),
                status: 200,
                message: message.userRegistered
            };
        });
    }).catch(e => {
        throw errorHandler(e);
    });
};

exports.login = data => {
    var body = pickUserCredentials(data);

    return User.findOne({ email: body.email })
        .then(user => {
            if (!user) {
                throw message.userNotFound;
            }
            return bcrypt.compare(body.password, user.password).then(response => {
                if (response) {
                    return user.generateAuthToken().then(token => {
                        return {
                            result: pickUserProfileResponse(user),
                            status: 200,
                            token: token.token,
                            message: message.loggedIn
                        };
                    });
                } else {
                    throw message.invalidCredentials
                }
            })
        })
        .catch(e => {
            throw errorHandler(e);
        });
};
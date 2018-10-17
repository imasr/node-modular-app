// const message = require("../../../../config/messages").msg;
// const validateInput = require("../business/validation.business");
// const { User } = require("../models/user.model");
// const { errorHandler } = require("../../../helpers/errorHandling.helper");
// const { pickUserCredentials } = require("../../../helpers/pickProperties.helper");
// const { pickUserProfileResponse, pickRegistrationResponse } = require("../../../helpers/pickResponse.helper");
const _ = require("lodash");

exports.registration = data => {
    // return validateInput
    //     .password_validator(data.password)
    //     .then(result => {
    //         if (!result) {
    //             throw message.invalidPassword;
    //         }
    //         if (!data.countryCode) {
    //             throw message.countryCode;
    //         }
    //         let phone = `${data.countryCode}${data.phone}`;
    //         return validateInput.phone_validator(phone).then(value => {
    //             if (!value) {
    //                 throw message.invalidPhone;
    //             }
    //             if (!data.acceptTerms) {
    //                 throw message.acceptTerms;
    //             }
    //             var user = new User(data);
    //             return user.save().then(user => {
    //                 return user.generateAuthToken().then(token => {
    //                     return {
    //                         result: pickRegistrationResponse(user),
    //                         token: token,
    //                         status: 200,
    //                         message: message.userRegistered
    //                     };
    //                 });
    //             });
    //         });
    //     })
    //     .catch(e => {
    //         throw errorHandler(e);
    //     });
};

exports.login = data => {
    // var body = pickUserCredentials(data);

    // return User.findByCredentials(body.email, body.password)
    //     .then(user => {
    //         if (!user) {
    //             throw message.userNotFound;
    //         }
    //         return user.generateAuthToken().then(token => {
    //             return {
    //                 result: pickUserProfileResponse(user),
    //                 status: 200,
    //                 token: token,
    //                 message: message.loggedIn
    //             };
    //         });
    //     })
    //     .catch(e => {
    //         throw errorHandler(message.invalidCredentials);
    //     });
};
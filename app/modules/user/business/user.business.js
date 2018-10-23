import { msg as message } from "../../../../config/messages";
import { password_validator } from "./validation.business";
import { User } from "../models/user.model";
import { errorHandler } from "../../../helpers/errorHandling.helper";
import { pickUserCredentials } from "../../../helpers/pickProperties.helper";
import { pickUserProfileResponse, pickRegistrationResponse } from "../../../helpers/pickResponse.helper";
import _ from "lodash";
import { compare } from "bcrypt";

const registration = async (data) => {

    let validatePasssword = await password_validator(data.password)
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
}

const login = async (data) => {
    var body = pickUserCredentials(data);
    let user = await User.findOne({ email: body.email })
    if (!user) {
        throw message.userNotFound;
    }
    let verifiedPassword = await compare(body.password, user.password)
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
}
module.exports = {
    registration,
    login
};
import { msg as message } from "../../../../config/messages";
import { password_validator } from "./validation.business";
import { User } from "../models/user.model";
import { pickUserProfileResponse, pickRegistrationData, pickRegistrationResponse, pickUserCredentials, pickSociailAccountCredentials } from "../../../helpers/pickResponse.helper";
import { compare } from "bcrypt";
import { generateAuthToken } from "../../../util/generate.token";
import { socialloginResonse } from "../../../helpers/commonResponse.helper";


// registration
const registration = async (data) => {
    let body = pickRegistrationData(data);

    let userExist = await User.findOne({ email: body.email })
    if (userExist) {
        throw message.duplicateEmail
    }
    let validatePasssword = await password_validator(body.password)
    if (!validatePasssword) {
        throw message.invalidPassword
    }
    if (!body.acceptTerms) {
        throw message.acceptTerms
    }
    if (!body.name) {
        throw message.userRequired
    }
    let user = new User(body);
    let response = await user.save()
    if (response)
        return {
            result: pickRegistrationResponse(response),
            status: 200,
            message: message.userRegistered
        };
};


// login
const login = async (data) => {
    var body = pickUserCredentials(data);

    let user = await User.findOne({ email: body.email })
    if (!user) {
        throw message.userNotFound;
    }
    if (!user.password) {
        throw message.passworNotSet
    }
    let verifiedPassword = await compare(body.password, user.password)

    if (!verifiedPassword) {
        throw message.invalidCredentials
    } else {
        return {
            result: pickUserProfileResponse(user),
            status: 200,
            token: await generateAuthToken(user),
            message: message.loggedIn
        };
    }
}


//social login
const sociallogin = async (data) => {
    var body = pickSociailAccountCredentials(data);
    if (body.isGoogle) {
        body['googleData'] = {
            id: data.id
        }
    } else if (body.isFacebook) {
        body['facebookData'] = {
            id: data.id
        }
    } else if (body.isLinkedln) {
        body['linkedlnData'] = {
            id: data.id
        }
    } else if (body.isTwitter) {
        body['twitterData'] = {
            id: data.id
        }
    } else {
        throw message.invalidUser
    }
    let userExist = await User.findOne({ email: body.email })
    if (!userExist) {
        let user = new User(body);
        let registerUser = await user.save()
        if (registerUser) {
            return await socialloginResonse(registerUser)
        }
    } else if ((body.isGoogle && userExist.isGoogle) || (body.isTwitter && userExist.isTwitter) || (body.isFacebook && userExist.isFacebook) || (body.isLinkedln && userExist.isLinkedln)) {
        return await socialloginResonse(userExist)

    } else {
        let loggedUser = await User.findByIdAndUpdate(userExist._id, { $set: body }, { new: true })
        if (loggedUser) {
            return await socialloginResonse(loggedUser)
        }
    }
}



module.exports = {
    registration,
    login,
    sociallogin
};
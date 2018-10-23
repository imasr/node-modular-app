import { msg as message } from "../../../../config/messages";
import { password_validator } from "./validation.business";
import { User } from "../models/user.model";
import { pickUserProfileResponse, pickRegistrationResponse, pickUserCredentials, pickSociailAccountCredentials } from "../../../helpers/pickResponse.helper";
import { compare } from "bcrypt";
import { generateAuthToken } from "../../../util/generate.token";

//save query user
const saveUser = async data => {
    debugger
    console.log(data)
    let user = new User(data);
    console.log("data", user)
    let savedData = await user.save()
    if (savedData)
        return {
            result: pickRegistrationResponse(savedData),
            status: 200,
            message: message.userRegistered
        };
}

// registration
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
    let response = await saveUser(data)
    return response
};


// login
const login = async (data) => {
    var body = pickUserCredentials(data);

    let user = await User.findOne({ email: body.email })
    if (!user) {
        throw message.userNotFound;
    }
    let verifiedPassword = await compare(body.password, user.password)
    if (verifiedPassword) {
        return {
            result: pickUserProfileResponse(user),
            status: 200,
            token: await generateAuthToken(user),
            message: message.loggedIn
        };
    } else {
        throw message.invalidCredentials
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
    }
    let user = await User.findOne({ email: body.email })
    if (!user) {
        let registerUser = await saveUser(body)
        if (registerUser) {
            registerUser['token'] = await generateAuthToken(registerUser.result)
            return registerUser
        }
    } else if ((body.isGoogle && user.isGoogle) || (body.isTwitter && user.isTwitter) || (body.isFacebook && user.isFacebook) || (body.isLinkedln && user.isLinkedln)) {
        return {
            result: pickUserProfileResponse(user),
            status: 200,
            token: await generateAuthToken(user),
            message: message.loggedIn
        };
    } else {
        let loggedUser = await User.findByIdAndUpdate(user._id, { $set: body }, { new: true })
        if (loggedUser) {
            return {
                result: pickUserProfileResponse(user),
                status: 200,
                token: await generateAuthToken(loggedUser),
                message: message.loggedIn
            };
        }
    }
}

module.exports = {
    registration,
    login,
    sociallogin
};
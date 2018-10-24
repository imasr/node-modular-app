import { pickSociailAccountCredentials } from "./pickResponse.helper";
import { generateAuthToken } from "./../util/generate.token";
import { msg as message } from "../../config/messages";

exports.socialloginResonse = async (data) => {
    return {
        result: pickSociailAccountCredentials(data),
        status: 200,
        token: await generateAuthToken(data),
        message: message.loggedIn
    };
}
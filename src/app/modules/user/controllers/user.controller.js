import { registration, login, sociallogin } from "../business/user.business";
import { errorHandler } from "../../../helpers/errorHandling.helper";

// register a new user
const user_register = async (req, res) => {
    try {
        const result = await registration(req.body);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(400).send(errorHandler(e));
    };
}

// login an existing user and generate refresh jwt token
const user_login = async (req, res) => {
    try {
        const result = await login(req.body);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(400).send(errorHandler(e));
    }
}

// login user with social account and generate refresh jwt token
const social_login = async (req, res) => {
    try {
        const result = await sociallogin(req.body);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(400).send(e);
    }
}

module.exports = {
    user_register,
    user_login,
    social_login
};
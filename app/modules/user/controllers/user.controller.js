const user = require("../business/user.business");
const { errorHandler } = require("../../../helpers/errorHandling.helper");

// register a new user
exports.user_register = async (req, res) => {
    try {
        let register = await user.registration(req.body)
        if (register)
            res.status(200).send(register);
    } catch (e) {
        res.status(400).send(errorHandler(e));
    }
};

// login an existing user and generate refresh jwt token
exports.user_login = async (req, res) => {
    try {
        let login = await user.login(req.body)
        if (login)
            res.status(200).send(login);
    } catch (e) {
        res.status(400).send(errorHandler(e));
    }
};
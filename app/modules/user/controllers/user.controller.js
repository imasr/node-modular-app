const user = require("../business/user.business");
const { errorHandler } = require("../../../helpers/errorHandling.helper");

// register a new user
exports.user_register = (req, res) => {
    return user.registration(req.body)
        .then(result => {
            res.status(200).send(result);
        }).catch(e => {
            res.status(400).send(errorHandler(e));
        });;
};

// login an existing user and generate refresh jwt token
exports.user_login = (req, res) => {
    return user.login(req.body)
        .then(result => {
            res.status(200).send(result);
        }).catch(e => {
            res.status(400).send(errorHandler(e));
        });
};
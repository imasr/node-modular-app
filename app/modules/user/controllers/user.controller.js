const user = require("../business/user.business");

// register a new user
exports.user_register = (req, res) => {
    return user.registration(req)
        .then(result => {
            res.status(200).send(result);
        }).catch(e => {
            res.status(400).send(e);
        });;
};

// login an existing user and generate refresh jwt token
exports.user_login = (req, res) => {
    return user.login(req)
        .then(result => {
            res.status(200).send(result);
        }).catch(e => {
            res.status(400).send(e);
        });;;
};
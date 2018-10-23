const message = require("../../config/messages").msg;
exports.errorHandler = (e, status = 400) => {
    let errorMsg, msg;
    if (typeof e != "object") {
        msg = e;
    } else {
        if (e.message) {
            let err = e.message;
            if (err.includes("email_1 dup")) {
                msg = message.duplicateEmail;
            } else if (err.includes("phone_1 dup")) {
                msg = message.duplicatePhone;
            } else if (err.includes("valid email")) {
                msg = e.message;
            }
        } else {
            msg = message.invalidRequest;
        }
    }
    errorMsg = {
        // error: e,
        status: status,
        message: msg
    };
    return errorMsg;
};

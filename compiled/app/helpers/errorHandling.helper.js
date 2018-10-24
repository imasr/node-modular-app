"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var message = require("../../config/messages").msg;
exports.errorHandler = function (e) {
    var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;

    var errorMsg = void 0,
        msg = void 0;
    if ((typeof e === "undefined" ? "undefined" : _typeof(e)) != "object") {
        msg = e;
    } else {
        if (e.message) {
            var err = e.message;
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
//# sourceMappingURL=errorHandling.helper.js.map
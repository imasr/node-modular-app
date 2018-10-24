"use strict";

var mongoose = require("mongoose");
var validator = require("validator");
var bcrypt = require("bcrypt");

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    phone: {
        type: Number,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        sparse: true,
        trim: true,
        minlength: 1,
        validate: {
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email"
        },
        lowercase: true
    },
    password: {
        type: String,
        required: function required() {
            if (!!this.isGoogle || !!this.isFacebook || !!this.isLinkedln || !!this.isTwitter) {
                return false;
            }
            return false;
        },
        minlength: 8
    },
    acceptTerms: {
        type: Boolean,
        required: function required() {
            if (!!this.isGoogle || !!this.isFacebook || !!this.isLinkedln || !!this.isTwitter) {
                return false;
            }
            return false;
        }
    },
    isGoogle: {
        type: Boolean
    },
    isFacebook: {
        type: Boolean
    },
    isLinkedln: {
        type: Boolean
    },
    isTwitter: {
        type: Boolean
    },
    facebookData: {
        type: JSON,
        required: function required() {
            return this.isFacebook == true;
        }
    },
    googleData: {
        type: JSON,
        required: function required() {
            return this.isGoogle == true;
        }
    },
    linkedlnData: {
        type: JSON,
        required: function required() {
            return this.isLinkedln == true;
        }
    },
    twitterData: {
        type: JSON,
        required: function required() {
            return this.isTwitter == true;
        }
    }
}, {
    timestamps: true,
    versionKey: false
});

UserSchema.pre('save', function (next) {
    var _this = this;

    if (!!this.password) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(_this.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                _this.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model("User", UserSchema);

module.exports = {
    User: User
};
//# sourceMappingURL=user.model.js.map
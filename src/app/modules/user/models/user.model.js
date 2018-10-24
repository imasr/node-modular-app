const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {
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
            required: function () {
                if (!!this.isGoogle || !!this.isFacebook || !!this.isLinkedln || !!this.isTwitter) {
                    return false
                }
                return false
            },
            minlength: 8
        },
        acceptTerms: {
            type: Boolean,
            required: function () {
                if (!!this.isGoogle || !!this.isFacebook || !!this.isLinkedln || !!this.isTwitter) {
                    return false
                }
                return false
            }
        },
        isGoogle: {
            type: Boolean,
        },
        isFacebook: {
            type: Boolean,
        },
        isLinkedln: {
            type: Boolean,
        },
        isTwitter: {
            type: Boolean,
        },
        facebookData: {
            type: JSON,
            required: function () {
                return this.isFacebook == true;
            }
        },
        googleData: {
            type: JSON,
            required: function () {
                return this.isGoogle == true;
            }
        },
        linkedlnData: {
            type: JSON,
            required: function () {
                return this.isLinkedln == true;
            }
        },
        twitterData: {
            type: JSON,
            required: function () {
                return this.isTwitter == true;
            }
        }
    }, {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.pre('save', function (next) {
    if (!!this.password) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                this.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


var User = mongoose.model("User", UserSchema);


module.exports = {
    User
};

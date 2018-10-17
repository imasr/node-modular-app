const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
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
            required: true,
            minlength: 8
        },
        avatar: {
            type: String,
            default: ""
        }
    }, {
        timestamps: true,
        versionKey: false
    }
);

var User = mongoose.model("User", UserSchema);

module.exports = {
    User
};

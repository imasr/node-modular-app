const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            required: true,
            minlength: 8
        },
        acceptTerms: {
            type: Boolean,
            required: true
        }
    }, {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.pre('save', function (next) {
    console.log(this, 'sss')
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

// for generating jwt auth token

UserSchema.methods.generateAuthToken = function () {
    return new Promise((resolve, reject) => {
        this.token = jwt.sign({ _id: this._id.toHexString() }, process.env.secret_token).toString();
        resolve(this);
    });
};


var User = mongoose.model("User", UserSchema);

module.exports = {
    User
};

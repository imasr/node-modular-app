const mongoose = require("mongoose");
const validator = require("validator");
const { errorHandler } = require("../../../helpers/errorHandling.helper");
var config = require("../../../../config/config");
var secret = config.jwt_secret;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  removeContactGroupsRefs,
  removeUserContactsRefs,
  removeTagsByUserId
} = require("../../../helpers/removeUserWithRefs.helper");

const status = Object.freeze({
  1: "Online",
  2: "Do Not Disturb",
  3: "Away",
  4: "Invisible",
  5: "Offline"
});
// defining the schema for the Model User
const deviceSchema = new mongoose.Schema({
  deviceType: String,
  browserInfo: String,
  deviceToken: String
});

const userSettingsSchema = new mongoose.Schema({
  theme: String,
  language: String,
  smsNotifications: Boolean,
  emailNotifications: {
    global: Boolean,
    reminder: Boolean,
    feedback: Boolean,
    product: Boolean,
    news: Boolean
  },
  pushNotifications: {
    global: Boolean,
    contacts: {
      global: Boolean,
      request: Boolean,
      accept: Boolean
    },
    messaging: {
      global: Boolean,
      room: Boolean,
      media: Boolean
    },
    cargoFeeds: {
      global: Boolean,
      assets: Boolean,
      tags: Boolean
    }
  }
});

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
      required: function () {
        if (this.isFacebook || this.isGoogle) {
          return false;
        } else {
          return true;
        }
      },
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
        if (this.isInvited || this.isFacebook || this.isGoogle) {
          return false;
        } else {
          return true;
        }
      },
      minlength: 8
    },
    isInvited: {
      type: Boolean,
      default: false
    },
    deviceInfo: [deviceSchema],
    avatar: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    resetToken: {
      type: String,
      default: null
    },
    tokenExpiryTime: Date,
    userStatus: {
      onlineStatus: {
        type: String,
        default: "Offline",
        enum: Object.values(status)
      },
      lastOnlineTimestamp: Date,
      lastSeenOnlineAt: String,
      showLastSeen: {
        type: Boolean,
        default: true
      }
    },
    lastOnlineTime: Date,
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    accountState: String,
    otp: {
      type: String,
      default: null
    },
    emailVerifyCode: {
      type: String,
      default: null
    },
    emailVerifyToken: {
      type: String,
      default: null
    },
    accountType: Number,
    isFacebook: Boolean,
    isGoogle: Boolean,
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
    countryCode: String,
    acceptTerms: {
      type: Boolean,
      required: true
    },
    userPreferences: String,
    company: JSON,
    userCompanyRoles: [
      {
        companyRoles: String
      }
    ],
    userSettings: userSettingsSchema,
    userIndustry: [
      {
        industryId: mongoose.Schema.Types.ObjectId,
        industrySectorId: mongoose.Schema.Types.ObjectId,
        userRole: String
      }
    ],
    userCompanyService: [
      {
        companyServices: String
      }
    ],
    conversationIds: [mongoose.Schema.Types.ObjectId]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

/**** helper methods, statics and hooks *****/

// for generating jwt auth token

UserSchema.methods.generateAuthToken = function () {
  return new Promise((resolve, reject) => {
    var user = this;
    var token = jwt
      .sign(
        {
          _id: user._id.toHexString()
        },
        secret
      )
      .toString();
    user.token = token;
    resolve(token);
  });
};

// for validating jwt auth token

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id
  })
    .then(user => {
      if (!user) {
        return Promise.reject();
      } else {
        return Promise.resolve(user);
      }
    })
    .catch(e => {
      res.status(401).end(e.message);
    });
};

// for user login and compare password with generated hash

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({
    email: email
  }).then(user => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    }).catch(e => {
      console.log(e);
    });
  });
};

// pre save hook for generating password hash

UserSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// pre update hook for generating password hash

UserSchema.pre("findOneAndUpdate", function (next) {
  const password = this.getUpdate().$set.password;
  if (!password) {
    return next();
  }
  try {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    this.getUpdate().$set.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});
var User = mongoose.model("User", UserSchema);

//pre remove hook for deleting related data in collections
User.schema.pre(
  "remove",
  function (next) {
    var userId = this.id;
    removeUserContactsRefs(userId)
      .then(contactRefs => {
        if (contactRefs) removeContactGroupsRefs(userId, contactRefs);
      })
      .catch(e => {
        throw e;
      });
    removeTagsByUserId(userId);
    next();
  },
  cb => {
    next(cb);
  }
);

module.exports = {
  User,
  status
};

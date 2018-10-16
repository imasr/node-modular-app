const message = require("../../../../config/messages").msg,
  { User, status } = require("../models/user.model"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  { pickUserProfileResponse } = require("../../../helpers/pickResponse.helper"),
  { pickOnlineStatus } = require("../../../helpers/pickProperties.helper");

exports.setOnlineStatus = data => {
  var userid = data.user._id;
  var presence = data.query["presence"];
  var showlastSeen = data.query["showlastSeen"];
  var body = pickOnlineStatus(data.query);
  body.onlineStatus = status[data.query.onlineStatus] || "";

  return User.findById({ _id: userid })
    .then(user => {
      if (
        (presence === "yes") &
        (showlastSeen == "true" || showlastSeen == "false")
      ) {
        return updateShowLastSeen(userid, showlastSeen).then(res => {
          return res;
        });
      } else {
        if (presence === "yes" && body.onlineStatus) {
          return updateUserStatus(userid, body).then(res => {
            return res;
          });
        } else if (
          user.userStatus.onlineStatus == "Offline" &&
          presence == "yes"
        ) {
          body.onlineStatus = "Online";
          return updateUserStatus(userid, body).then(res => {
            return res;
          });
        } else if (
          user.userStatus.onlineStatus === "Online" &&
          presence === "no"
        ) {
          body.onlineStatus = "Offline";
          return updateUserStatus(userid, body).then(res => {
            return res;
          });
        } else {
          return {
            result: pickUserProfileResponse(user),
            status: 200,
            message: data.msg.success
          };
        }
      }
    })
    .catch(err => {
      throw errorHandler(err);
    });
};

let updateUserStatus = (userid, body) => {
  body.lastOnlineTimestamp = Date.now();
  return User.findOneAndUpdate(
    { _id: userid },
    {
      $set: {
        "userStatus.onlineStatus": body.onlineStatus,
        "userStatus.lastOnlineTimestamp": body.lastOnlineTimestamp
      }
    },
    { new: true, runValidators: true }
  )
    .then(user => {
      if (!user) {
        throw message.userNotFound;
      }
      return {
        result: pickUserProfileResponse(user),
        status: 200,
        message: message.success
      };
    })
    .catch(err => {
      throw errorHandler(err);
    });
};

var updateShowLastSeen = (userid, showLastSeen) => {
  console.log(showLastSeen);
  return User.findOneAndUpdate(
    { _id: userid },
    {
      $set: {
        "userStatus.showLastSeen": showLastSeen
      }
    },
    { new: true, runValidators: true }
  )
    .then(user => {
      if (!user) {
        throw message.userNotFound;
      }
      return {
        result: pickUserProfileResponse(user),
        status: 200,
        message: message.success
      };
    })
    .catch(err => {
      throw errorHandler(err);
    });
};

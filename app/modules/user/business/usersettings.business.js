const _ = require("lodash"),
  { User } = require("../models/user.model"),
  { languages } = require("../models/user.languages"),
  { errorHandler } = require("../../../helpers/errorHandling.helper"),
  { pickEmailNotificationsResult } = require("../../../helpers/pickResponse.helper"),
  { pickSMSNotificationsResult } = require("../../../helpers/pickResponse.helper"),
  { pickPushNotificationsResult } = require("../../../helpers/pickResponse.helper"),
  { pickUserSettingsResult } = require("../../../helpers/pickResponse.helper"),
  { pickUserProfileLanguageResponse } = require("../../../helpers/pickResponse.helper"),
  { pickEmailNotificationsProperties } = require("../../../helpers/pickProperties.helper"),
  { pickPushNotificationsProperties } = require("../../../helpers/pickProperties.helper"),
  { pickPushNotificationsContactsProperties } = require("../../../helpers/pickProperties.helper"),
  { pickPushNotificationsMessagingProperties } = require("../../../helpers/pickProperties.helper"),
  { pickPushNotificationsCargoFeedsProperties } = require("../../../helpers/pickProperties.helper");

exports.getUserSettings = data => {
  const userId = data.user._id;
  return User.findById(userId)
    .then(user => {
      return {
        result: pickUserSettingsResult(user),
        status: 200,
        message: data.msg.success
      };
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

exports.setSMSNotifications = data => {
  const userId = data.user._id;
  const notifications = data.body.notifications;

  return User.findByIdAndUpdate(userId,
    { $set: { "userSettings.smsNotifications": notifications } },
    { new: true }
  )
    .then(user => {
      return {
        result: pickSMSNotificationsResult(user),
        status: 200,
        message: data.msg.success
      };
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

exports.setEmailNotifications = data => {
  const userId = data.user._id;
  const notifications = pickEmailNotificationsProperties(data.body.notifications);

  return User.findById(userId)
    .then(user => {
      for (prop in notifications) {
        user.userSettings.emailNotifications[prop] = notifications[prop];
      }
      return user.save()
        .then(user => {
          return {
            result: pickEmailNotificationsResult(user),
            status: 200,
            message: data.msg.success
          };
        });
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

exports.setPushNotifications = data => {
  const userId = data.user._id;
  const notifications = pickPushNotificationsProperties(data.body.notifications);

  const contacts = pickPushNotificationsContactsProperties(notifications.contacts);
  const messaging = pickPushNotificationsMessagingProperties(notifications.messaging);
  const cargoFeeds = pickPushNotificationsCargoFeedsProperties(notifications.cargoFeeds);

  return User.findById(userId)
    .then(user => {
      if (_.isBoolean(notifications.global)) {
        user.userSettings.pushNotifications.global = notifications.global;
      }
      for (prop in contacts) {
        user.userSettings.pushNotifications.contacts[prop] = contacts[prop];
      }
      for (prop in messaging) {
        user.userSettings.pushNotifications.messaging[prop] = messaging[prop];
      }
      for (prop in cargoFeeds) {
        user.userSettings.pushNotifications.cargoFeeds[prop] = cargoFeeds[prop];
      }

      return user.save()
        .then(user => {
          return {
            result: pickPushNotificationsResult(user),
            status: 200,
            message: data.msg.success
          };
        });
    })
    .catch(e => {
      throw errorHandler(e);
    });
};

exports.changeLanguage = data => {
  const userId = data.user._id;
  const language = data.body.language.toLowerCase();
  let message = data.msg;

  if (_.map(languages).indexOf(language) < 0) {
    throw message.invalidLanguage;
  }

  return User.findByIdAndUpdate(
    { _id: userId },
    { $set: { "userSettings.language": language } },
    { safe: true, new: true }
  ).then(user => {
    message = eval(language);
    return {
      result: pickUserProfileLanguageResponse(user),
      status: 200,
      message: message.success
    };
  })
    .catch(e => {
      throw errorHandler(e);
    });
}
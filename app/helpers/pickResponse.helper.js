const _ = require("lodash");

exports.pickUserResponse = data => {
  let response = _.pick(data, [
    "id",
    "firstName",
    "lastName",
    "email",
    "location",
    "phone",
    "countryCode",
    "isEmailVerified",
    "isPhoneVerified"
  ]);
  return response;
};

exports.pickUserProfileResponse = data => {
  let response = _.pick(data, [
    "id",
    "firstName",
    "lastName",
    "email",
    "avatar",
    "location",
    "phone",
    "countryCode",
    "isEmailVerified",
    "isPhoneVerified",
    "userStatus"
  ]);
  return response;
};

exports.pickUserResponseWithToken = data => {
  let response = _.pick(data, [
    "id",
    "firstName",
    "lastName",
    "email",
    "location",
    "phone",
    "countryCode",
    "resetToken",
    "isEmailVerified",
    "isPhoneVerified"
  ]);
  return response;
};

exports.pickVerifyResponse = data => {
  return _.pick(data, [
    "id",
    "firstName",
    "lastName",
    "email",
    "phone",
    "countryCode",
    "isEmailVerified",
    "isPhoneVerified"
  ]);
};

exports.pickRegistrationResponse = data => {
  var response = _.pick(data, ["id", "firstName", "lastName", "email", "phone", "countryCode"]);
  return response;
};

exports.pickGetUserResult = data => {
  var response = _.map(
    data,
    _.partialRight(_.pick, [
      "id",
      "firstName",
      "lastName",
      "email",
      "avatar",
      "location",
      "phone",
      "countryCode",
      "isEmailVerified",
      "isPhoneVerified",
      "userStatus"
    ])
  );
  return response;
};

exports.pickSearchUserResult = data => {
  var response = _.map(
    data,
    _.partialRight(_.pick, [
      "contactId",
      "firstName",
      "lastName",
      "email",
      "phone",
      "countryCode",
      "requestStatus",
      "userStatus",
      "avatar"
    ])
  );
  return response;
};

exports.pickEnterpriseUserResult = data => {
  return _.pick(data, [
    "id",
    "firstName",
    "lastName",
    "email",
    "phone",
    "countryCode",
    "company",
    "userStatus",
    "avatar"
  ]);
};

exports.pickResetPasswordResult = data => {
  return _.pick(data, [
    "id",
    "firstName",
    "lastName",
    "email",
    "phone",
    "countryCode",
    "resetToken"
  ]);
};

exports.pickSSOTokenResponse = data => {
  return _.pick(data, ["sso"]);
};

exports.pickUserProfileLanguageResponse = data => {
  let response = _.pick(data, ["id", "firstName", "lastName", "userSettings"]);
  return response;
};

exports.pickSMSNotificationsResult = data => {
  return _.pick(data, ["userSettings.smsNotifications"]);
};

exports.pickEmailNotificationsResult = data => {
  return _.pick(data, ["userSettings.emailNotifications"]);
};

exports.pickPushNotificationsResult = data => {
  return _.pick(data, ["userSettings.pushNotifications"]);
};

exports.pickUserSettingsResult = data => {
  return _.pick(data, ["userSettings"]);
};

exports.pickGetRequestsResult = data => {
  return _.pick(data, ["userId", "receivedRequests"]);
};

exports.pickContactsResult = data => {
  return _.pick(data, [
    "contactId",
    "requestStatus",
    "firstName",
    "lastName",
    "email",
    "avatar",
    "location",
    "phone",
    "countryCode",
    "userStatus",
    "isFavorite",
    "conversationId"
  ]);
};

exports.pickContactGroupResult = data => {
  return {
    groupId: data._id,
    groupName: data.groupName,
    groupContacts: data.groupContacts.map(pickGroupContacts)
  };
};

const pickGroupContacts = data => {
  return _.pick(data, [
    "contactId",
    "firstName",
    "lastName",
    "email",
    "avatar",
    "location",
    "phone",
    "countryCode",
    "userStatus"
  ]);
};

exports.pickContactGroup = data => {
  let res = _.pick(data, ["name", "id", "members"]);
  res.groupId = res.id;
  res.conversationId = res.id;
  res.groupName = res.name;
  res.contacts = [];
  res.members.map(contact => {
    if (!contact.deactivatedDate) {
      res.contacts.push(
        _.pick(contact, ["contactId", "firstName", "lastName", "email", "avatar", "isAdmin"])
      );
    }
  });
  delete res.name;
  delete res.members;
  delete res.id;
  return res;
};

exports.pickConversationP2P = data => {
  let res = _.pick(data, ["id", "name", "members"]);
  res.conversationId = res.id;
  res.contacts = memberPicker(res.members);
  delete res.name;
  delete res.members;
  delete res.id;
  return res;
};

exports.pickConversationResponse = (data, messages, userId, req = null) => {
  let res = [];
  data.map(conv => {
    conv = _.pick(conv, ["id", "name", "type", "avatar", "members"]);
    conv.conversationId = conv.id;
    if (conv.type == 1) {
      conv.members.map(m => {
        if (m.contactId != userId) {
          conv.name = `${m.firstName} ${m.lastName}`;
        }
      });
    }
    delete conv.id;
    conv.members = memberPicker(conv.members);
    if (messages) {
      let msgArray = [];
      messages.map(msg => {
        if (msg.conversationId == conv.conversationId) {
          msgArray.push(msg);
        }
      });
      msgArray = _.sortBy(msgArray, "createdAt").reverse();
      conv.lastMessage = _.pick(msgArray[0], ["senderId", "content", "createdAt", "updatedAt"]);
      if (!req.params.id) {
        res.push(conv);
      } else {
        res = conv;
      }
    }
  });

  return res;
};

exports.pickGroupResponse = (req, data) => {
  let res = [];
  data.map(conv => {
    conv = _.pick(conv, ["id", "name", "type", "avatar", "members"]);
    conv.groupId = conv.id;
    conv.groupName = conv.name;
    conv.contacts = memberPicker(conv.members);
    delete conv.name;
    delete conv.members;
    conv.conversationId = conv.id;
    delete conv.id;
    if (!req.params.id) {
      res.push(conv);
    } else {
      res = conv;
    }
  });
  return res;
};

exports.pickMessagesResponse = data => {
  let response = _.map(
    data,
    _.partialRight(_.pick, ["conversationId", "senderId", "content", "createdAt", "updatedAt"])
  );
  return response;
};

const memberPicker = members => {
  let contacts = [];
  members.map(member => {
    member = _.pick(member, [
      "contactId",
      "firstName",
      "lastName",
      "email",
      "avatar",
      "isAdmin",
      "deactivatedDate"
    ]);
    if (member.deactivatedDate == null) {
      delete member.deactivatedDate;
      contacts.push(member);
    }
  });
  return contacts;
};

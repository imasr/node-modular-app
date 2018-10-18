const msg = {
    success: "Ok",
    emailVerified: "Email has been successfully verified",
    phoneVerified: "Phone number has been successfully verified",
    passwordReset: "Password has been successfully updated",
    invalidRequest: "Invalid request",
    validationError: "Validation error",
    userRegistered: "User registration successful",
    duplicateError: "User already activated",
    userNotFound: "User not found",
    ownIdRequest: "You can't send contact request to your own Id",
    invalidCredentials: "Password you have entered is invalid! Please Try Again",
    loggedIn: "Succesfully Logged in User",
    userRemoved: "User account successfully removed",
    mockThirdParty: {
        activated: "User has been activated successfully",
        duplicateError: "User already activated",
        invalidCredentials: "Email or password is invalid"
    },
    invalidPhone: "Phone number is not valid",
    invalidEmail: "Email address is not valid",
    acceptTerms: "Please accept the terms to continue",
    invalidPassword: "Password validation failed",
    verificationRequest: "A verification code has been sent to you on your phone number/Email provided",
    resetPassLink: "A reset password link has been sent to your registered email address.",
    invalidToken: "The verification code you have entered is not correct please request a new one",
    expiredLink: "The email verification link has been expired, Please request again.",
    activatedAccount: "You have already activated your account",
    expiredToken: "Verification Token Expired.",
    invalidResetToken: "Reset password link is not valid, Please request again with a valid reset token",
    expiredResetToken: "The reset password link has been expired, Please request again",
    invalidUserId: "Invalid User Id",
    invalidCompany: "Invalid company Id",
    contactCreated: "Contact successfully created",
    contactBlocked: "Contact is blocked",
    contactBlockedByMe: "Contact is blocked by you",
    contactBlockedSuccess: "Contact is successfully blocked",
    contactUnblockedSuccess: "Contact is successfully unblocked",
    noBlockedUsers: "No blocked users",
    contactExists: "Contact already exists",
    contactRequestSent: "You have already sent contact request to this user",
    contactReceivedRequest: "You have already got a request from user",
    requestExists: "This user already sent you a request",
    contactNotFound: "Contact not found",
    noContacts: "User has no contacts",
    requestNotFound: "Request not found",
    operationFailed: "Operation failed",
    duplicateEmail: "User with provided email address already exists",
    duplicatePhone: "User with provided phone number already exists",
    countryCode: "Please input country code",
    unauthorisedRequest: "You are not authorised to perform this action",
    contactGroupsNotFound: "Contact groups not found",
    groupCreated: "Group successfully created",
    groupNameExists: "Group name already exists",
    contactGroupUpdated: "Contact group has been successfully updated",
    contactGroupNotUpdated: "Contact group has not been updated",
    notActivated: "You have not yet activated your account. Please check your inbox for further instructions.",
    emailNotVerified: "The email entered is unverified, Please verify your account by requesting email verification to proceed.",
    notActivated: "You have not yet activated your account. Please check your inbox for further instructions.",
    invalidLanguage: "Invalid language",
    tagNameExists: "Tag name has already been used",
    invalidTagId: "Invalid tag id",
    invalidGroupId: "Invalid group id",
    invalidStatus: "Invalid online status",
    conversationExists: "Conversation with this contact already exists",
    invalidConversationId: "Conversation id is invalid",
    notGroup: "This is not a group conversation",
    notMember: "You are not a member of this group",
    notAdmin: "You have no permissions to update group details",
    memberDeactivated: "You are already left from group",
    memberNotFound: "There is no member with this contact id",
    deactivatedMember: "This member is deactivated"
};

const pushMsg = {
    contacts: {
        sentRequests: {
            title: "You have received a contact request",
            body: "has sent you a contact request, Go to the app to accept or decline."
        },
        acceptRequest: {
            title: "Contact request accepted",
            body: "has accepted your contact request."
        }
    }
};
module.exports = {
    msg,
    pushMsg
};

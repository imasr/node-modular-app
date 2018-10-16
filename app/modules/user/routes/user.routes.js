const express = require("express");
const router = express.Router();

const user = require("../../user/controllers/user.controller"),
  forgotpassword = require("../../user/controllers/forgotpassword.controller"),
  resetpassword = require("../../user/controllers/resetpassword.controller"),
  mockuser = require("../controllers/mockuser.controller"),
  verify = require("../../user/controllers/verifyotp.controller"),
  userSettings = require("../../user/controllers/usersettings.controller"),
  { jwt_middleware } = require("../../../middleware/jwt.middleware");

// route configurations
router.post("/", user.user_register);
router.get("/status", jwt_middleware, user.onlineStatus);
router.get("/search", jwt_middleware, user.userSearch);
router.get("/", user.getUsers);
router.get("/:id", user.getUsers);
router.put("/", jwt_middleware, user.updateUser);
router.delete("/:id", user.deleteUsers);
router.post("/login", user.user_login);
router.post("/forgotpassword", forgotpassword.user_forgot_password);
router.post("/resetpassword", resetpassword.user_reset_password);
router.post("/verify-email", verify.verifyEmail);
router.post("/verify-otp", verify.verifyotp);
router.post("/mockuser", mockuser.mock_user);
router.post("/user-verification", user.user_verification);
router.post("/social/signup", user.socialSignUp);
router.post("/social/login", user.socialSignIn);
router.post("/notifications/devicetoken", jwt_middleware, user.deviceToken);
router.post("/upload/avatar", jwt_middleware, user.uploadAvatar);

// UserSettings
router.get("/settings/get", jwt_middleware, userSettings.getUserSettings);
router.post(
  "/settings/smsnotifications",
  jwt_middleware,
  userSettings.setSMSNotifications
);
router.post(
  "/settings/emailnotifications",
  jwt_middleware,
  userSettings.setEmailNotifications
);
router.post(
  "/settings/pushnotifications",
  jwt_middleware,
  userSettings.setPushNotifications
);
router.put("/settings/language", jwt_middleware, userSettings.changeLanguage);

module.exports = router;

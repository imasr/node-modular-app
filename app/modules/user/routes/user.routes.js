import { Router } from "express";
const router = Router();

import { user_register, user_login } from "../../user/controllers/user.controller";

router.post("/register", user_register);
router.post("/login", user_login);


module.exports = {
    router
};

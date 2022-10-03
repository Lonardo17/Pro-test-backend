const express = require("express");
const {
  userRegistration,
  userLogin,
  userLogout,
  getCurrentUser,
  loginGoogleUsers,
} = require("../../controllers/controllerUsers");
const { googleAuth } = require("../../controllers/googleAuth");
const { userValidate } = require("../../middlewares/validateUsers");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const authenticateGogle = require("../../middlewares/auhenticate-social");

const router = express.Router();

router.post("/registration", userValidate, userRegistration);
router.post("/authorization", userValidate, userLogin);
router.get("/logout", authMiddleware, userLogout);
router.get("/current", authMiddleware, getCurrentUser);
router.post("/googlelogin", loginGoogleUsers);

router.get(
  "/google",
  authenticateGogle.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  authenticateGogle.authenticate("google", { successRedirect: "/auth" }),
  googleAuth
);

module.exports = router;

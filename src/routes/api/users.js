const express = require("express");
const {
  userRegistration,
  userLogin,
  userLogout,
  getCurrentUser,
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
router.get(
  "/google",
  authenticateGogle.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  authenticateGogle.authenticate("google", { session: false }),
  googleAuth
);

module.exports = router;

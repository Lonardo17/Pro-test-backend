const express = require("express");
const {
  userRegistration,
  userLogin,
  userLogout,
  getCurrentUser,
} = require("../../controllers/controllerUsers");
const { userValidate } = require("../../middlewares/validateUsers");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/registration", userValidate, userRegistration);
router.post("/authorization", userValidate, userLogin);
router.get("/logout", authMiddleware, userLogout);
router.get("/current", authMiddleware, getCurrentUser);

module.exports = router;

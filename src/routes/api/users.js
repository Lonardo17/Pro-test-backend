const express = require("express");
const {
  userRegistration,
  userLogin,
  userLogout,
} = require("../../controllers/controllerUsers");
const { userValidate } = require("../../middlewares/validateUsers");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.get("/registration", userValidate, userRegistration);
router.get("/authorization", userValidate, userLogin);
router.get("/logout", authMiddleware, userLogout);

module.exports = router;

const express = require("express");
const { getTestQuestions } = require("../../controllers/controllerTest");
const { validate } = require("../../middlewares/validateTestRoutes");
const { testSchemaValidate } = require("../../service/testSchemaValidate");

const router = express.Router();

router.get("/:testType", validate(testSchemaValidate), getTestQuestions);

module.exports = router;

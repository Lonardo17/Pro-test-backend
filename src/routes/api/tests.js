const express = require("express");
const {
  getTestQuestions,
  getAnswers,
} = require("../../controllers/controllerTest");
const { answersSchemaValidate } = require("../../middlewares/validateAnswers");
const { validate } = require("../../middlewares/validateTestRoutes");
const { testSchemaValidate } = require("../../service/testSchemaValidate");

const router = express.Router();

router.get("/:testType", validate(testSchemaValidate), getTestQuestions);
router.post("/result", answersSchemaValidate, getAnswers);
module.exports = router;

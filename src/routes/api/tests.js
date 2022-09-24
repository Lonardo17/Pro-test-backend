const express = require("express");
const { getTestQuestions } = require("../../controllers/controllerTest");
const { validate } = require("../../middlewares/validate");
const { testSchemaValidate } = require("../../service/testSchemaValidate");

const router = express.Router();

router.post("/", validate(testSchemaValidate), getTestQuestions);

module.exports = router;

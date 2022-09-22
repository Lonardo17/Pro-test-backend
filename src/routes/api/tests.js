const express = require("express");
const { getTestQuestions } = require("../../controllers/controllerTest");
const { validate } = require("../../middlewares/validate");
const { testSchemaValidate } = require("../../service/testSchemaValidate");

const router = express.Router();

router.get("/", validate(testSchemaValidate), getTestQuestions);

module.exports = router;

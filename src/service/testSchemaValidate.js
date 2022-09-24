const Joi = require("joi");

const testSchemaValidate = Joi.object({
  testType: Joi.any().valid("testing_theory", "technical_training").required(),
});

module.exports = { testSchemaValidate };

const Joi = require("joi");

const testSchemaValidate = Joi.object({
  testType: Joi.any().valid("testing theory", "technical training").required(),
});

module.exports = { testSchemaValidate };

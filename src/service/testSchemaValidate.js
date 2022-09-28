const Joi = require("joi");

const testSchemaValidate = Joi.object({
  testType: Joi.string()
    .trim()
    .required()
    .regex(/^(testing_theory|technical_training)$/)
    .messages({
      "string.pattern.base":
        "testType is a required, must be testing_theory or technical_training",
    }),
});

module.exports = { testSchemaValidate };

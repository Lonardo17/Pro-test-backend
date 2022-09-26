const Joi = require("joi");

const userValidate = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
  });
  const validateData = schema.validate(req.body);

  if (validateData.error)
    return res.json({
      status: "Bad Request",
      code: 400,
      message: "Ошибка от Joi или другой библиотеки валидации",
    });
  next();
};

module.exports = { userValidate };

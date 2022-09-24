const { NotFound } = require("http-errors");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.validate(req.params);

    if (result.error) {
      throw new NotFound();
    }

    req.params = result.value;
    next();
  };
}

module.exports = {
  validate,
};

const { testSchemaValidate } = require("../service/testSchemaValidate");

const answersSchemaValidate = async (req, res, next) => {
  try {
    const { answers } = req.body;
    await testSchemaValidate.validateAsync(req.body);
    const data = JSON.parse(answers);
    if (
      !(
        Array.isArray(data) &&
        data?.length === 12 &&
        data.every((el) => typeof el === "object")
      )
    ) {
      throw new Error("answers is incorrect");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { answersSchemaValidate };

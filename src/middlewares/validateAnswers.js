const { testSchemaValidate } = require("../service/testSchemaValidate");

const answersSchemaValidate = async (req, res, next) => {
  try {
    const { answers } = req.body;
    await testSchemaValidate.validateAsync({ testType: req.body?.testType });
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
    console.log(err);
    next(err);
  }
};

module.exports = { answersSchemaValidate };

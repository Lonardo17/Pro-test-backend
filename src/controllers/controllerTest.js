const { getRandomTestQuestions } = require("../service/testService");

const getTestQuestions = async (req, res, next) => {
  try {
    const newTest = await getRandomTestQuestions(req.params.testType);

    return res.status(200).json({
      status: "success",
      testData: newTest,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getTestQuestions };

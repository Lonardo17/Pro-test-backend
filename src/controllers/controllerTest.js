const { getRandomTestQuestions } = require("../service/testService");
const { QATechTraining, TestingTheory } = require("../database/testSchema");
const { theoryTest } = require("../utils/constants");

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

const getAnswers = async (req, res, next) => {
  try {
    const { answers, testType } = req.body;
    const data = JSON.parse(answers);
    const ids = data.map((el) => el.id);
    const filters = { questionId: { $in: ids } };
    const getAllQuestionsByIds =
      testType === theoryTest
        ? await TestingTheory.find(filters)
        : await QATechTraining.find(filters);
    let result = 0;
    for (const el of data) {
      for (const e of getAllQuestionsByIds) {
        if (el.id === e.questionId && el.option === e.rightAnswer) {
          result++;
          break;
        }
      }
    }
    return res.status(200).json({
      status: "success",
      result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getTestQuestions, getAnswers };

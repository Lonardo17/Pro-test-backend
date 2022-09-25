const { QATechTraining, TestingTheory } = require("../database/testSchema");
const { theoryTest, testQuestionsCount } = require("../utils/constants");

async function getRandomTestQuestions(testType) {
  if (!testType) {
    throw new Error();
  }

  const arrayOfQuestions =
    testType === theoryTest
      ? await TestingTheory.find()
      : await QATechTraining.find();

  const arrayOfRandomIndexes = getRandomIndexes(
    arrayOfQuestions.length,
    testQuestionsCount
  );

  const neededArrayOfQuestions = arrayOfQuestions.reduce(
    (prev, curr, index) => {
      if (arrayOfRandomIndexes.includes(index)) {
        return [...prev, curr];
      } else {
        return [...prev];
      }
    },
    []
  );

  return neededArrayOfQuestions;
}

function getRandomIndexes(arrayLength, countOfIndexes) {
  const arrayOfAllIndexes = [];
  for (let i = 0; i < arrayLength; i += 1) {
    arrayOfAllIndexes.push(i);
  }

  let arrayOfRandomIndexes = new Array(countOfIndexes);

  arrayOfRandomIndexes = arrayOfRandomIndexes
    .fill(0)
    .map(() => renderRandomIndex(arrayOfAllIndexes));

  return arrayOfRandomIndexes;
}

function renderRandomIndex(fullArray) {
  const newRandomIndex = Math.floor(Math.random() * fullArray.length);

  if (fullArray.includes(newRandomIndex)) {
    const index = fullArray.indexOf(newRandomIndex);
    fullArray.splice(index, 1);
    return newRandomIndex;
  } else {
    return renderRandomIndex(fullArray);
  }
}

module.exports = { getRandomTestQuestions };

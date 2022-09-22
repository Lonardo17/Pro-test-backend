const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testsSchema = new Schema({
  question: {
    type: String,
    required: [true],
    unique: [true],
  },
  questionId: {
    type: Number,
    unique: [true],
  },
  answers: [String],
  rightAnswer: {
    type: String,
    required: [true],
  },
});

const QATechTraining = mongoose.model("technical training", testsSchema);
const TestingTheory = mongoose.model("testing theory", testsSchema);

module.exports = { QATechTraining, TestingTheory };

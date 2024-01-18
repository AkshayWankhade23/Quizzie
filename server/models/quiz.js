
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  quizName: { type: String, required: true },
  quizType: { type: String, enum: ["Q&A", "Poll"], required: true },
  question: { type: String },
  optionsType: {
    type: String,
    enum: ["Text", "Image URL", "Text & Image URL"],
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, "Options should have 2 to 4 elements"],
  },
  correctOptionIndex: { type: Number, required: false },
  timer: { type: String, enum: ["OFF", "5sec", "10sec"], required: true },
});

function arrayLimit(val) {
  return val.length >= 2 && val.length <= 4;
}

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
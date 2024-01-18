
const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");

// Error Handling Middleware
const errorHandler = (res, error) => {
  console.error(error.stack);
  res.status(500).json({ message: "Internal Server Error", error: error.message });
};

// Create Quiz API
router.post("/quizzes", async (req, res) => {
  try {
    const { quizName, quizType, question, optionsType, options, timer } = req.body;

    if (!quizName || !quizType || !question || !optionsType || !options || !timer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["Q&A", "Poll"].includes(quizType)) {
      return res.status(400).json({ message: "Invalid quiz type" });
    }

    if (!["Text", "Image URL", "Text & Image URL"].includes(optionsType)) {
      return res.status(400).json({ message: "Invalid options type" });
    }

    if (options.length < 2 || options.length > 4) {
      return res.status(400).json({ message: "Options should have 2 to 4 elements" });
    }

    // Create new quiz
    const newQuiz = new Quiz({
      quizName,
      quizType,
      question,
      optionsType,
      options,
      timer,
    });

    // Save new quiz created
    await newQuiz.save();

    return res.json({
      message: "Quiz Created Successfully!",
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

// Get Quizzes API with optional filtering by quizType
router.get("/quizzes", async (req, res) => {
  try {
    const { quizType } = req.query;

    if (quizType && !["Q&A", "Poll"].includes(quizType)) {
      return res.status(400).json({ message: "Invalid quiz type" });
    }

    let query = {};
    if (quizType) {
      query.quizType = quizType;
    }

    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
    return res.json({ quizzes });
  } catch (error) {
    errorHandler(res, error);
  }
});

// Get Quiz by ID API
router.get("/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.json({ quiz });
  } catch (error) {
    errorHandler(res, error);
  }
});

module.exports = router;

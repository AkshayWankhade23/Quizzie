
// // routes/quiz.js
// const express = require("express");
// const router = express.Router();
// const Quiz = require("../models/quiz");
// const Question = require("../models/question");
// const Option = require("../models/option");

// // Create a new quiz
// router.post("/quizzes", async (req, res) => {
//   try {
//     const { name, type, questionsData } = req.body;

//     // Create quiz
//     const quiz = new Quiz({ name, type });

//     // Create questions
//     const questions = [];
//     for (const qData of questionsData) {
//       const question = new Question(qData);

//       // Create options
//       question.options = await Option.insertMany(qData.options);

//       // Set correct option
//       question.correctOption = question.options.find((option) =>
//         option._id.equals(qData.correctOption)
//       );

//       // Save question
//       await question.save();
//       questions.push(question);
//     }

//     // Save questions
//     quiz.questions = questions;
//     await quiz.save();

//     res.status(201).json(quiz);
//   } catch (error) {
//     // console.error(error);
//     console.error('Error creating quiz:', error);

//     // Handle validation errors
//     if (error.name === "ValidationError") {
//       return res.status(400).json({ error: error.message });
//     }

//     // res.status(500).json({ error: "Internal Server Error" });
//     res.status(500).json({ error: error.message || 'Internal Server Error' });
//   }
// });


// // Get quiz by ID
// router.get("/quizzes/:quizId", async (req, res) => {
//   try {
//     const quizId = req.params.quizId;

//     // Fetch quiz data
//     const quiz = await Quiz.findById(quizId).populate({
//       path: 'questions',
//       populate: {
//         path: 'options',
//       },
//     });

//     if (!quiz) {
//       return res.status(404).json({ error: 'Quiz not found' });
//     }

//     // Extract relevant information for response
//     const { name, type, questions } = quiz;
//     const formattedQuestions = questions.map((question) => ({
//       text: question.text,
//       options: question.options.map((option) => ({
//         id: option._id,
//         value: option.value,
//       })),
//       correctOption: question.correctOption ? question.correctOption._id : null,
//       timer: question.timer,
//     }));

//     // Respond with the formatted quiz data
//     res.json({
//       name,
//       type,
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching quiz data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// module.exports = router;

// routes/quiz.js
const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Option = require("../models/option");

// Create a new quiz
router.post("/quizzes", async (req, res) => {
  try {
    const { name, type, questionsData } = req.body;

    // Create quiz
    const quiz = new Quiz({ name, type });

    // Create questions
    const questions = [];
    for (const qData of questionsData) {
      const question = new Question(qData);

      // Create options
      question.options = await Option.insertMany(qData.options);

      // Set correct option
      question.correctOption = question.options.find((option) =>
        option._id.equals(qData.correctOption)
      );

      // Save question
      await question.save();
      questions.push(question);
    }

    // Save questions
    quiz.questions = questions;
    await quiz.save();

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Get quiz by ID
router.get("/quizzes/:quizId", async (req, res) => {
  try {
    const quizId = req.params.quizId;

    // Fetch quiz data
    const quiz = await Quiz.findById(quizId).populate({
      path: 'questions',
      populate: {
        path: 'options',
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Extract relevant information for response
    const { name, type, questions } = quiz;
    const formattedQuestions = questions.map((question) => ({
      text: question.text,
      options: question.options.map((option) => ({
        id: option._id,
        value: option.value,
      })),
      correctOption: question.correctOption ? question.correctOption._id : null,
      timer: question.timer,
    }));

    // Respond with the formatted quiz data
    res.json({
      name,
      type,
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


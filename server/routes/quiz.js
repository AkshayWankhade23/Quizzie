// const express = require("express");
// const router = express.Router();
// const Quiz = require("../models/quiz");

// // Error Handling Middleware
// const errorHandler = (res, error) => {
//   console.error(error.stack);
//   res.status(500).json({ message: "Internal Server Error", error: error.message });
// };

// // Create Quiz API
// router.post("/quizzes", async (req, res) => {
//   try {
//     const { quizName, quizType, question, optionsType, options, timer } = req.body;

//     if (!quizName || !quizType || !question || !optionsType || !options || !timer) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (!["Q&A", "Poll"].includes(quizType)) {
//       return res.status(400).json({ message: "Invalid quiz type" });
//     }

//     if (!["Text", "Image URL", "Text & Image URL"].includes(optionsType)) {
//       return res.status(400).json({ message: "Invalid options type" });
//     }

//     if (options.length < 2 || options.length > 4) {
//       return res.status(400).json({ message: "Options should have 2 to 4 elements" });
//     }

//     // Create new quiz
//     const newQuiz = new Quiz({
//       quizName,
//       quizType,
//       question,
//       optionsType,
//       options,
//       timer,
//     });

//     // Save new quiz created
//     await newQuiz.save();

//     return res.json({
//       message: "Quiz Created Successfully!",
//     });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// });

// // Get Quizzes API with optional filtering by quizType
// router.get("/quizzes", async (req, res) => {
//   try {
//     const { quizType } = req.query;

//     if (quizType && !["Q&A", "Poll"].includes(quizType)) {
//       return res.status(400).json({ message: "Invalid quiz type" });
//     }

//     let query = {};
//     if (quizType) {
//       query.quizType = quizType;
//     }

//     const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
//     return res.json({ quizzes });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// });

// // Get Quiz by ID API
// router.get("/quizzes/:id", async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.id);

//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     return res.json({ quiz });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// });

// module.exports = router;

//**************************************************************************** */

// const express = require("express");
// const router = express.Router();
// const Quiz = require("../models/quiz");

// // Error Handling Middleware
// const errorHandler = (res, error) => {
//   console.error(error.stack);
//   res
//     .status(500)
//     .json({ message: "Internal Server Error", error: error.message });
// };

// // Create Quiz API
// router.post("/quizzes", async (req, res) => {
//   try {
//     const { quizName, quizType, questions } = req.body;

//     // Validation
//     if (!quizName || !quizType || !questions) {
//       return res
//         .status(400)
//         .json({ message: "Quiz name, type, and questions are required" });
//     }

//     if (!["Q&A", "Poll"].includes(quizType)) {
//       return res.status(400).json({ message: "Invalid quiz type" });
//     }

//     // Validate each question
//     for (const question of questions) {
//       const { questionText, optionsType, options, timer } = question;

//       if (!questionText || !optionsType || !timer) {
//         console.log("Validation Error in question:", question);
//         return res
//           .status(400)
//           .json({ message: "All fields are required for each question" });
//       }

//       if (!["Text", "Image URL", "Text & Image URL"].includes(optionsType)) {
//         console.log("Validation Error in question:", question);
//         return res.status(400).json({ message: "Invalid options type" });
//       }

//       if (
//         !options ||
//         !Array.isArray(options) ||
//         options.length < 2 ||
//         options.length > 4 ||
//         options.some((option) => !option.trim())
//       ) {
//         console.log("Validation Error in question:", question);
//         return res.status(400).json({ message: "Invalid options" });
//       }
//     }

//     // Create new quiz
//     const newQuiz = new Quiz({
//       quizName,
//       quizType,
//       questions,
//     });

//     // Save new quiz created
//     await newQuiz.save();

//     return res.json({
//       message: "Quiz Created Successfully!",
//     });
//   } catch (error) {
//     console.error("Error saving quiz:", error.message);
//     errorHandler(res, error);
//   }
// });

// // Get Quizzes API with optional filtering by quizType
// router.get("/quizzes", async (req, res) => {
//   try {
//     const { quizType } = req.query;

//     if (quizType && !["Q&A", "Poll"].includes(quizType)) {
//       return res.status(400).json({ message: "Invalid quiz type" });
//     }

//     const query = quizType ? { quizType } : {};
//     const quizzes = await Quiz.find(query).sort({ _id: -1 });

//     return res.json({ quizzes });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// });

// // Get Quiz by ID API
// router.get("/quizzes/:id", async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.id);

//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     return res.json({ quiz });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// });

// module.exports = router;








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
//       const options = qData.options.map((optionData) => new Option(optionData));
//       question.options = options;

//       // Set correct option
//       question.correctOption = options.find((option) =>
//         option._id.equals(qData.correctOption)
//       );

//       // Save options
//       await Option.insertMany(options);

//       // Save question
//       await question.save();
//       questions.push(question);
//     }

//     // Save questions
//     quiz.questions = questions;
//     await quiz.save();

//     res.status(201).json(quiz);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
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
    // console.error(error);
    console.error('Error creating quiz:', error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    // res.status(500).json({ error: "Internal Server Error" });
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;


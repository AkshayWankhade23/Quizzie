// // models/question.js
// const mongoose = require('mongoose');

// const questionSchema = new mongoose.Schema({
//   text: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     enum: ['text', 'image_url', 'text_image_url'],
//     required: true,
//   },
//   options: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Option',
//     },
//   ],
//   correctOption: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Option',
//   },
//   timer: {
//     type: String,
//     enum: ['OFF', '5sec', '10sec'],
//   },
// });

// const Question = mongoose.model('Question', questionSchema);

// module.exports = Question;


const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Text', 'Image URL', 'Text & Image URL'],
    required: true,
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Option',
    },
  ],
  correctOption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
  },
  timer: {
    type: String,
    enum: ['OFF', '5sec', '10sec'],
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
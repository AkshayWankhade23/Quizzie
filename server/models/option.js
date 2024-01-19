// // models/option.js
// const mongoose = require('mongoose');

// const optionSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ['text', 'image_url', 'text_image_url'],
//     required: true,
//   },
//   value: {
//     type: String,
//     required: true,
//   },
// });

// const Option = mongoose.model('Option', optionSchema);

// module.exports = Option;

const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image_url', 'text_image_url'],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;
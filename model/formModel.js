const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  budget: { type: Number, required: true },
  attachment: { type: Object } // Optional field
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);

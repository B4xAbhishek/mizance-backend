const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  communicationMethod: { type: String, required: true },
  contactTime: { type: String, required: true },
  projectType: { type: String, required: true },
  projectDescription: { type: String, required: true },
  selectedFeatures: [{ type: String }],
  budgetRange: { type: Number, required: true },
  timeframe: { type: Number, required: true },
  targetAudience: { type: String, required: true },
  preferredTechStack: [{ type: String }],
  uploadedFile: {
    filename: String,
    path: String,
    mimetype: String
  },
  scheduledMeeting: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);

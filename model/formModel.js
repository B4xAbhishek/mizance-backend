const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  communicationMethod: {
    type: String,
    default: null
  },
  contactTime: {
    type: String,
    default: null
  },
  projectType: {
    type: String,
    default: null
  },
  projectDescription: {
    type: String,
    default: null
  },
  selectedFeatures: {
    type: [String],
    default: []
  },
  budgetRange: {
    type: String,  // Changed to String since it's coming as string in payload
    default: null
  },
  timeframe: {
    type: String,  // Changed to String since it's coming as string in payload
    default: null
  },
  targetAudience: {
    type: String,
    default: null
  },
  preferredTechStack: {
    type: [String],
    default: []
  },
  uploadedFile: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  scheduledMeeting: {
    type: String,  // Changed to String to match payload format
    default: null
  }
}, {
  timestamps: true,
  strict: true  // Changed to true to ensure only defined fields are saved
});

// Add logging middleware
formSchema.pre('save', function(next) {
  console.log('Data being saved:', JSON.stringify(this.toObject(), null, 2));
  next();
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
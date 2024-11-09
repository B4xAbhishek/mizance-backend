// index.js
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

// CORS Configuration
app.use(cors({
  origin: '*', 
  methods: '*',
  allowedHeaders: '*',
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 200
}));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected');
}).catch((error) => {
  console.error('Database connection error:', error);
});

// Schema and model
const formSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  communicationMethod: { type: String, default: null },
  contactTime: { type: String, default: null },
  projectType: { type: String, default: null },
  projectDescription: { type: String, default: null },
  uploadedFile: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

formSchema.pre('save', function (next) {
  console.log('Data being saved:', JSON.stringify(this.toObject(), null, 2));
  next();
});

const Form = mongoose.model('Form', formSchema);

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = async (formData, attachmentPath) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'b4xabhishek@gmail.com',
    subject: 'New Project Inquiry',
    text: `
      New Project Inquiry Received!

      Contact Details:
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone}
      Preferred Communication: ${formData.communicationMethod}
      Preferred Contact Time: ${formData.contactTime}

      Project Details:
      Type: ${formData.projectType}
      Description: ${formData.projectDescription}

    `,
    attachments: attachmentPath ? [{
      filename: path.basename(attachmentPath),
      path: attachmentPath
    }] : []
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Form submission endpoint
app.post('/api/forms/submit', upload.single('uploadedFile'), async (req, res) => {
  try {
    const formData = new Form({
      ...req.body,
      uploadedFile: req.file ? req.file.path : null
    });

    const savedForm = await formData.save();
  // const emailSent = await sendMail(savedForm, req.file ? req.file.path : null);

    res.status(200).json({
      message: 'Form submitted successfully',
      emailStatus: 'Email sending failed',
      formData: savedForm
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({
      message: 'Error submitting form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error('Error retrieving forms:', error);
    res.status(500).json({ message: 'Error retrieving forms' });
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

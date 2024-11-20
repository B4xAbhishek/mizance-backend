const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
}).then(() => console.log('Database connected'))
  .catch((error) => console.error('Database connection error:', error));

// Schema and model
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  communicationMethod: String,
  contactTime: String,
  projectType: String,
  projectDescription: String,
  uploadedFile: {
    data: Buffer,
    contentType: String,
    filename: String
  }
}, { timestamps: true });

formSchema.pre('save', function (next) {
  const dataToLog = { ...this.toObject() };
  if (dataToLog.uploadedFile?.data) {
    dataToLog.uploadedFile.data = '<Buffer>';
  }
  console.log('Data being saved:', JSON.stringify(dataToLog, null, 2));
  next();
});

const Form = mongoose.model('Form', formSchema);

// Utility function to send email (placeholder)
const sendMail = async (formData) => {
  // Add email sending logic here (e.g., nodemailer)
  return true; // Placeholder for success
};

// Form submission endpoint
app.post('/api/forms/submit', async (req, res) => {
  try {
    const { name, email, phone, communicationMethod, contactTime, projectType, projectDescription, uploadedFile } = req.body;

    // Validate uploaded file size
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 5 MB
    if (uploadedFile?.data && Buffer.byteLength(uploadedFile.data, 'base64') > MAX_FILE_SIZE) {
      return res.status(400).json({ message: 'File too large' });
    }

    const formData = new Form({
      name,
      email,
      phone,
      communicationMethod,
      contactTime,
      projectType,
      projectDescription,
      uploadedFile: uploadedFile ? {
        data: Buffer.from(uploadedFile.data, 'base64'),
        contentType: uploadedFile.contentType,
        filename: uploadedFile.filename
      } : null
    });

    const savedForm = await formData.save();
    const emailSent = await sendMail(savedForm);

    res.status(200).json({
      message: 'Form submitted successfully',
      emailStatus: emailSent ? 'Email sent successfully' : 'Email sending failed',
      formData: {
        ...savedForm.toObject(),
        uploadedFile: savedForm.uploadedFile ? {
          filename: savedForm.uploadedFile.filename,
          contentType: savedForm.uploadedFile.contentType
        } : null
      }
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({
      message: 'Error submitting form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Fetch all forms (excluding file data)
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find({}, { 'uploadedFile.data': 0 });
    res.json(forms);
  } catch (error) {
    console.error('Error retrieving forms:', error);
    res.status(500).json({ message: 'Error retrieving forms' });
  }
});

// Download file endpoint
app.get('/api/forms/:id/download', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form?.uploadedFile) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set({
      'Content-Type': form.uploadedFile.contentType,
      'Content-Disposition': `attachment; filename="${form.uploadedFile.filename}"`
    }).send(form.uploadedFile.data);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
});

// Health check endpoint
app.get('/', (req, res) => res.send('OK working'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

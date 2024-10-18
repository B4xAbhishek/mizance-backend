const Form = require('../model/formModel');
const nodemailer = require('nodemailer');
const path = require('path'); // For working with file paths

// Create transporter object using SMTP settings (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your email from .env
    pass: process.env.EMAIL_PASS   // Your email password from .env
  }
});

// Function to send email
const sendMail = async (formData, attachmentPath) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'b4xabhishek@gmail',  // Replace with your email address
    subject: 'Form Submission Success',
    text: `Form submitted successfully!\n\nDetails:\nName: ${formData.name}\nEmail: ${formData.email}\nDate: ${formData.date}\nBudget: ${formData.budget}`,
    html: `<h1>Form Submitted Successfully</h1>
           <p><strong>Name:</strong> ${formData.name}</p>
           <p><strong>Email:</strong> ${formData.email}</p>
           <p><strong>Date:</strong> ${formData.date}</p>
           <p><strong>Budget:</strong> ${formData.budget}</p>`,
    // Attach file if present
    attachments: attachmentPath ? [{
      filename: path.basename(attachmentPath),
      path: attachmentPath
    }] : []
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

// Controller for handling form submissions
exports.submitForm = async (req, res) => {
  try {
    const { name, email, date, budget } = req.body;
    const attachment = req.file ? req.file.path : null;  // Get uploaded file path, if present

    // Create a new form entry
    const formData = new Form({
      name,
      email,
      date,
      budget,
      attachment // Save the file path in the attachment field
    });

    // Save the form data to the database
    await formData.save();

    // Send a success email after form submission, with the attachment if present
    await sendMail(formData, attachment);

    // Send response to the client
    res.status(200).json({ message: 'Form submitted successfully and email sent' });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ message: 'Error submitting form', error });
  }
};

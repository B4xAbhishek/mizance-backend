const Form = require('../model/formModel');
const nodemailer = require('nodemailer');
const path = require('path');

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
    to: 'b4xabhishek@gmail',
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
      Budget Range: $${formData.budgetRange}
      Timeframe: ${formData.timeframe} months

      Target Audience: ${formData.targetAudience}

      Required Features:
      ${formData.selectedFeatures.join('\n')}

      Preferred Technologies:
      ${formData.preferredTechStack.join('\n')}

      Meeting Scheduled: ${new Date(formData.scheduledMeeting).toLocaleString()}
    `,
    html: `
      <h1>New Project Inquiry Received!</h1>

      <h2>Contact Details:</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Preferred Communication:</strong> ${formData.communicationMethod}</p>
      <p><strong>Preferred Contact Time:</strong> ${formData.contactTime}</p>

      <h2>Project Details:</h2>
      <p><strong>Type:</strong> ${formData.projectType}</p>
      <p><strong>Description:</strong> ${formData.projectDescription}</p>
      <p><strong>Budget Range:</strong> $${formData.budgetRange}</p>
      <p><strong>Timeframe:</strong> ${formData.timeframe} months</p>

      <p><strong>Target Audience:</strong> ${formData.targetAudience}</p>

      <h2>Required Features:</h2>
      <ul>
        ${formData.selectedFeatures.map(feature => `<li>${feature}</li>`).join('')}
      </ul>

      <h2>Preferred Technologies:</h2>
      <ul>
        ${formData.preferredTechStack.map(tech => `<li>${tech}</li>`).join('')}
      </ul>

      <p><strong>Meeting Scheduled:</strong> ${new Date(formData.scheduledMeeting).toLocaleString()}</p>
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
    console.error('Error sending email: ', error);
    return false;
  }
};

exports.submitForm = async (req, res) => {
  try {
    // Create a new form entry with all fields from the payload
    const formData = new Form(req.body);

    // Save the form data to the database
    const savedForm = await formData.save();

    // Send email
    const emailSent = await sendMail(savedForm, savedForm.uploadedFile);

    // Return both success message and saved form data
    res.status(200).json({
      message: 'Form submitted successfully',
      emailStatus: emailSent ? 'Email sent successfully' : 'Email sending failed',
      formData: savedForm
    });

  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ 
      message: 'Error submitting form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
const express = require('express');
const connectDB = require('./config/db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Step Form API',
      version: '1.0.0',
      description: 'API for handling multi-step form submissions',
      contact: {
        name: 'Developer',
        email: 'b4xabhishek@gmail.com'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 5000}`, // Dynamic server URL based on your PORT
        },
      ],
    },
  },
  apis: ['./routes/*.js'], // Path to the route files where Swagger documentation comments are added
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const formRoutes = require('./routes/formRoutes');
app.use('/api/forms', formRoutes); // Mount the form routes

// Define the hardcoded dropdown options
const dropdownOptions = [
    { key: 'option1', value: 'Option 1' },
    { key: 'option2', value: 'Option 2' },
    { key: 'option3', value: 'Option 3' },
    { key: 'option4', value: 'Option 4' }
  ];
  
  // API to return dropdown options
  app.get('/api/dropdowns/options', (req, res) => {
    res.json({ success: true, data: dropdownOptions });
  });

// Get the port from environment variables or use default port 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

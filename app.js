
// importing the modules for the app likeexpress and path
const express = require('express');
const path = require('path');

// importing modules from routes folder 
const indexRouter = require('./routes/index');

const app = express(); // Creating an Express app

// below are the middleware for the app and also what we are using in the project 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Setting up routes
app.use('/', indexRouter); // Handling routes for the main site and API

// if any request is made it shows this error  with error code 
app.use(function (req, res, next) {
  res.status(404).send('404: Page Not Found!!!!');
});

// Starting the server
const PORT = process.env.PORT || 1552;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // exporting the app

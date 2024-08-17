// this is the routes for the project we can also use this in app.js but it becomes messy that's why we cretaed sepearte file 
// importing required modules 
const express = require('express');
const router = express.Router();
const path = require('path');
const ctrlAPI = require('../controllers/api');

// routes to render html file 
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// api routes for task operations from the api.js in the controller 
router.get('/api/tasks', ctrlAPI.getTasks); // get all tasks
router.post('/api/tasks', ctrlAPI.createTask); // add a new task
router.put('/api/tasks/:id', ctrlAPI.updateTask); // update a task
router.delete('/api/tasks/:id', ctrlAPI.deleteTask); // delete a task
router.delete('/api/tasks', ctrlAPI.clearTasks); // clear all tasks

module.exports = router; 

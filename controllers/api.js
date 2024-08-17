// importing data model from the model folder to work with data storage means data.txt file where our task stores 
const modelAPI = require('../models/data');

// fn to get all tasks
const getTasks = async (req, res) => {
  // fetch tasks from the data file
  const tasks = await modelAPI.getData();
  // sending fetched task as a json
  res.json(tasks);
};

// fn to create newtask
const createTask = async (req, res) => {
  const task = req.body;
  const newTask = await modelAPI.saveData(task);
  res.json(newTask);
};

// fn to update task 
const updateTask = async (req, res) => {
  const id = req.params.id;
  const updatedTask = req.body;
  const result = await modelAPI.updateData(id, updatedTask);
  res.json(result);
};

// fn to delete particular task when user hit delete btn in ui
const deleteTask = async (req, res) => {
  const id = req.params.id;
  const result = await modelAPI.deleteData(id);
  res.json({ success: result });
};

// fn to clear all task 
const clearTasks = async (req, res) => {
  const result = await modelAPI.clearAllData();
  res.json({ success: result });
};

// simpple above all fn fetch data perform opertaion and send in json format 

// exporting all fn
module.exports = { getTasks, createTask, updateTask, deleteTask, clearTasks };

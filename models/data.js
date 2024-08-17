const fs = require("fs").promises;
//file to store data
const fileName = "data.txt";


// fn to get all tasks from the file
const getData = async () => {
  try {
    // read the file content
    const data = await fs.readFile(fileName, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading data:", error);
    // if there is error it return empty error
    return [];
  }
};

// fn to save a new task to the file
const saveData = async (task) => {
  try {
    // geting existing tasks from the file 
    const tasks = await getData();
    // pusing to task 
    tasks.push(task);
    //saving with new task
    await fs.writeFile(fileName, JSON.stringify(tasks, null, 2));
    return task;
  } catch (error) {
    console.error("Error saving data:", error);
    return null;
  }
};

// fn to update to existing task in the file
const updateData = async (id, updatedTask) => {
  try {
    let tasks = await getData();
    tasks = tasks.map(task => task.id === id ? updatedTask : task);
    await fs.writeFile(fileName, JSON.stringify(tasks, null, 2));
    return updatedTask;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

// fn to delete a task from the file
const deleteData = async (id) => {
  try {
    let tasks = await getData();
    tasks = tasks.filter(task => task.id !== id);
    await fs.writeFile(fileName, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error("Error deleting data:", error);
    return false;
  }
};

// fn to clear all tasks from the file
const clearAllData = async () => {
  try {
    // make file empty 
    await fs.writeFile(fileName, JSON.stringify([], null, 2));
    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    return false;
  }
};



module.exports = { getData, saveData, updateData, deleteData, clearAllData }; // Exporting the functions
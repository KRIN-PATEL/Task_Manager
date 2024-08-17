
// array fot random colour 
const colors = ['#f1f8e9', '#e0f7fa', '#ffe0b2', '#d1c4e9', '#c8e6c9', '#ffccbc', '#ffeb3b', '#b3e5fc', '#ffccbc', '#dcedc8'];

// generate different id for tasks with date
function generateId() {
    return 'id' + Date.now();
}

// clear input fields of the form when user added the task
function clearInputFields() {
    document.getElementById('taskDescription').value = '';
    document.getElementById('assignedTo').value = '';
    document.getElementById('assignedDate').value = '';
    document.getElementById('assignedBy').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('priority').value = 'medium';
}

// this fn fetc all task from the server means file and display in tasklist 
async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    displayTasks(tasks);
}

// fn to add task 
async function addTask() {
    const taskDescription = document.getElementById('taskDescription').value.trim();
    if (!taskDescription) {
        alert('Please enter a task description!!!!');
        return;
    }

    const task = {
        id: generateId(),
        description: taskDescription,
        assignedTo: document.getElementById('assignedTo').value.trim(),
        assignedDate: document.getElementById('assignedDate').value,
        assignedBy: document.getElementById('assignedBy').value.trim(),
        dueDate: document.getElementById('dueDate').value,
        priority: document.getElementById('priority').value,
        status: 'pending'
    };
    // below code contain post request to add new task and send it in json format to the file 
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });

    if (response.ok) {
        // refresh the task list with newly added task 
        fetchTasks();
        clearInputFields();
    }
}

// fn to edit the tasks 
async function editTask(id) {
    //fetch task from tasks 
    const response = await fetch(`/api/tasks`);
    const tasks = await response.json();
    //find the task with particular id to  edit
    const task = tasks.find(task => task.id === id);

    if (task) {
        const newDescription = prompt('Edit Task Description:', task.description);
        if (newDescription !== null && newDescription.trim() !== '') {
            task.description = newDescription.trim();
            task.assignedTo = prompt('Edit Assigned To:', task.assignedTo) || task.assignedTo;
            task.assignedDate = prompt('Edit Assigned Date:', task.assignedDate) || task.assignedDate;
            task.assignedBy = prompt('Edit Assigned By:', task.assignedBy) || task.assignedBy;
            task.dueDate = prompt('Edit Due Date:', task.dueDate) || task.dueDate;
            task.priority = prompt('Edit Priority (high/medium/low):', task.priority) || task.priority;


            // put request is used to update the task in the file 
            await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });
            //after editing the task it refress it with new detials 
            fetchTasks();
        }
    }
}

//delete task with specific id 
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
    });
    fetchTasks();
}


// fn to display task fetch from the server 
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        li.style.backgroundColor = colors[index % colors.length];

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.description;

        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';
        taskDetails.innerHTML = `
            <p><strong>Assigned To:</strong> ${task.assignedTo}</p>
            <p><strong>Assigned Date:</strong> ${task.assignedDate}</p>
            <p><strong>Assigned By:</strong> ${task.assignedBy}</p>
            <p><strong>Due Date:</strong> ${task.dueDate}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Status:</strong> ${task.status}</p>
        `;

        const taskButtons = document.createElement('div');
        taskButtons.className = 'task-buttons';

        const editButton = document.createElement('button');
        editButton.className = 'edit-btn edit';
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTask(task.id);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn delete';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);

        taskButtons.appendChild(editButton);
        taskButtons.appendChild(deleteButton);

        li.appendChild(taskText);
        li.appendChild(taskDetails);
        li.appendChild(taskButtons);

        taskList.appendChild(li);
    });
}


// fn to filter task baseed on user input 
async function filterTasks() {
    const searchText = document.getElementById('searchInput').value.trim().toLowerCase();
    const response = await fetch('/api/tasks');
    const tasks = await response.json();


    // it shows  all task from the server if the search bar is empty 
    if (searchText === '') {
        displayTasks(tasks);
        return;
    }

    const filteredTasks = tasks.filter(task =>
        task.description.toLowerCase().includes(searchText) ||
        task.assignedTo.toLowerCase().includes(searchText) ||
        task.assignedBy.toLowerCase().includes(searchText) ||
        task.priority.toLowerCase().includes(searchText) ||
        task.status.toLowerCase().includes(searchText)
    );

    displayTasks(filteredTasks); // display only filtered tasks
}

// fn to clear all tasks from the server 
function clearTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        fetch('/api/tasks', {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                fetchTasks();
            } else {
                alert('Failed to clear tasks');
            }
        });
    }
}


function showAddTaskSection() {
    document.getElementById('addTaskSection').style.display = 'block';
    document.getElementById('searchTaskSection').style.display = 'none';
}

function showSearchTaskSection() {
    document.getElementById('addTaskSection').style.display = 'none';
    document.getElementById('searchTaskSection').style.display = 'block';
}

function initTaskManager() {
    // load tasks from server
    fetchTasks();

    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('searchInput').addEventListener('input', filterTasks);
    document.getElementById('clearTasksBtn').addEventListener('click', clearTasks);
    document.getElementById('addTaskNav').addEventListener('click', showAddTaskSection);
    document.getElementById('searchTaskNav').addEventListener('click', showSearchTaskSection);
}

document.addEventListener('DOMContentLoaded', initTaskManager);

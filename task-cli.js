const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'tasks.json');

// Initialize the tasks file if it does not exist
function initializeFile() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
  }
}

// Read tasks from file
function readTasks() {
  initializeFile();
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

// Write tasks to file
function writeTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

// Add a new task
function addTask(description) {
  let tasks = readTasks();
  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1, // Increment ID
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  writeTasks(tasks);
  console.log(`Task added Successfully (ID: ${newTask.id})`);
}

// Update a task description
function updateTask(id, newDescription) {
  let tasks = readTasks();
  let task = tasks.find((t) => t.id == id);
  if (task) {
    task.description = newDescription;
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log(`Task updated successfully (ID: ${id})`);
  } else {
    console.log(`Task not found (ID: ${id})`);
  }
}

//Delete a task
function deleteTask(id) {
  let tasks = readTasks();
  let filteredTasks = tasks.filter((t) => t.id != id);
  if (tasks.length === filteredTasks.length) {
    console.log(`Task not found (ID: ${id})`);
    return;
  }
  writeTasks(filteredTasks);
  console.log(`Task deleted successfully (ID: ${id})`);
}

// Mark a task as in progress
function markInProgress(id) {
  let tasks = readTasks();
  let task = tasks.find((t) => t.id == id);
  if (task) {
    task.status = 'in-progress';
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log(`Task marked as in-progress (ID: ${id})`);
  } else {
    console.log(`Task not found (ID: ${id})`);
  }
}

// Mark a task as done
function markDone(id) {
  let tasks = readTasks();
  let task = tasks.find((t) => t.id == id);
  if (task) {
    task.status = 'done';
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log(`Task marked as Done (ID: ${id})`);
  } else {
    console.log(`Task not found (ID: ${id})`);
  }
}

//List tasks based on status(done, todo, in-progress)
function listTasks(filter = null) {
  let tasks = readTasks();

  if (filter) tasks = tasks.filter((t) => t.status === filter);
  console.log(tasks.length ? tasks : 'No tasks found.');
}

// Command line interface handling
const [, , command, ...args] = process.argv;
switch (command) {
  case 'add':
    addTask(args.join(' '));
    break;
  case 'update':
    updateTask(args[0], args.slice(1).join(' '));
    break;
  case 'delete':
    deleteTask(args[0]);
    break;
  case 'mark-in-progress':
    markInProgress(args[0]);
    break;
  case 'mark-done':
    markDone(args[0]);
    break;
  case 'list':
    listTasks(args[0]); // Optional filter
    break;
  default:
    console.log(
      'Commands: add <task>, update <id> <new description>, delete <id>, mark-in-progress <id>, mark-done <id>, list [status]'
    );
}

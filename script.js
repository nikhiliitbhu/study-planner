// Cheez            Kaam
// !important       CSS rule ko sabse strong bana dena
// .trim()          String ke aage-peeche khaali jagah hatana
// .appendChild()    Ek element ko doosre element ke andar jodna
const daysToboard = document.getElementById("daysLeft");


function toggleMode() {
  document.body.classList.toggle("dark-mode");
  let button = document.getElementById("darkToggle");
  if (document.body.classList.contains("dark-mode")) {
    button.textContent = "☀️";
  } else {
    button.textContent = "🌙";
  }
}
// Yeh ek khaali array hai - isme har task ek "object" ke roop me store hoga
let allTasks = [];

// Yeh function saare tasks ko screen pe dikhata hai
function showAllTasks() {

  // Pehle task list ka container dhundo (ye <ul id="taskList"> hai)
  let container = document.getElementById("taskList");

  // Purana sab kuch saaf kar do, taaki dobara na dikhe
  container.innerHTML = "";

  // Ab array ke har task ko ek-ek karke loop se ghoomo
  for (let i = 0; i < allTasks.length; i++) {

    let task = allTasks[i];

    let box = document.createElement("li");
    box.className = "task-card";

    box.innerHTML =
      '<div class="task-top-row">' +
        '<input type="checkbox" class="task-checkbox" onclick="toggleComplete(' + i + ')">' +
        '<p class="task-name">' + task.name + '</p>' +
        '<button class="delete-btn" onclick="deleteTask(' + i + ')">🗑️</button>' +
      '</div>' +
      '<br>' +
      '<div class="task-bottom-row">' +
        task.subject + '  |   ' + task.priority + ' |  📅   ' + task.dueDate +
      '</div>';

    container.appendChild(box);
  }

  // Yeh check function ke ANDAR hai, sabse last mein - har baar chalega
  let emptyState = document.getElementById("emptyState");
  if (allTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  // Stats bhi update karo har baar
  updateStats();
}

// Yeh function naya task add karta hai
function addNewTask() {

  let name = document.getElementById("taskInput").value;
  let subject = document.getElementById("subjectSelect").value;
  let dueDate = document.getElementById("dueDateInput").value;
  let priority = document.getElementById("prioritySelect").value;

  if (name.trim() === "") {
    alert("please enter any task!");
    return;
  }

  let newTask = {
    name: name,
    subject: subject,
    dueDate: dueDate,
    priority: priority,
    completed: false
  };

  allTasks.push(newTask);
  showAllTasks();
  document.getElementById("taskInput").value = "";
}

// Checkbox click hone par complete/incomplete switch karo
function toggleComplete(index) {
  if (allTasks[index].completed === true) {
    allTasks[index].completed = false;
  } else {
    allTasks[index].completed = true;
  }
  showAllTasks();
}

// Total, completed, pending count karke screen pe dikhao
function updateStats() {
  let total = allTasks.length;
  let completedCount = 0;
  let pendingCount = 0;

  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].completed === true) {
      completedCount = completedCount + 1;
    } else {
      pendingCount = pendingCount + 1;
    }
  }

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statDone").textContent = completedCount;
  document.getElementById("statPending").textContent = pendingCount;
}

// Task delete karne ke liye
function deleteTask(index) {
  allTasks.splice(index, 1);
  showAllTasks();
}

// Jab "Add Task" button click ho, addNewTask function chale
document.getElementById("addBtn").onclick = addNewTask;

showAllTasks();

const examDate=new Date("2027-2-20");
let numberOfDaysLeft = Math.ceil((examDate- new Date()) / (1000 * 60 * 60 * 24));
daysToboard.innerText = numberOfDaysLeft + " ";

// function clearhistory(){

//     document.getElementById("clearCompletedBtn").innerHTML =
//    "<p id='erase'>no content here.!</p>"
// // localstorage.clear();
//     localStorage.removeItem("clearCompletedBtn");}

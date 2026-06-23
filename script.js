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

    let task = allTasks[i];  // current task nikalo

    let box = document.createElement("li");  // ul ke andar li hona chahiye
    box.className = "task-card";  // styling ke liye class

    // Box ke andar task ki saari details daalo
    
    box.innerHTML = "<div class='task-details'>" +
                     "<p>" + task.name + "</p>" +
                     "<span>" + task.subject + "</span>" +
                     "<span>" + task.priority + "</span>" +
                     "<span>" + task.dueDate + "</span>"+
"</div>";
    // Box ko container mein add kar do
    container.appendChild(box);
  }
}

// Yeh function naya task add karta hai
function addNewTask() {

  // Input boxes se values uthao
  let name = document.getElementById("taskInput").value;
  let subject = document.getElementById("subjectSelect").value;
  let dueDate = document.getElementById("dueDateInput").value;
  let priority = document.getElementById("prioritySelect").value;

  // Check karo ki task ka naam khali to nahi hai
  if (name.trim() === "") {
    alert("please enter any task!");
    return; // function se bahar nikal jao
  }

  // Ek naya object banao jisme saari details ho
  let newTask = {
    name: name,
    subject: subject,
    dueDate: dueDate,
    priority: priority
  };

  // Naye task ko array mein daal do
  allTasks.push(newTask);

  // Screen ko dobara dikhao taaki naya task bhi nazar aaye
  showAllTasks();

  // Input box khaali kar do agle task ke liye
  document.getElementById("taskInput").value = "";
}

// Jab "Add Task" button click ho, addNewTask function chale
document.getElementById("addBtn").onclick = addNewTask;
function showAllTasks() {

  let container = document.getElementById("taskList");
  container.innerHTML = "";

  for (let i = 0; i < allTasks.length; i++) {

    let task = allTasks[i];

    let box = document.createElement("li");
    box.className = "task-card";

    box.innerHTML =
      '<div class="task-top-row">' +
        '<input type="checkbox" class="task-checkbox">' +
        '<span class="task-name">' + task.name + '</span>' +
      +
      
        task.subject + ' | ' + task.priority + ' | 📅 ' + task.dueDate +
      '</div>';

    container.appendChild(box);
  }
}

const examDate=new Date("2027-2-20");
let numberOfDaysLeft = Math.ceil((examDate- new Date()) / (1000 * 60 * 60 * 24));
daysToboard.innerText = numberOfDaysLeft + " ";

// // Cheez            Kaam
// // !important       CSS rule ko sabse strong bana dena
// // .trim()          String ke aage-peeche khaali jagah hatana
// // .appendChild()    Ek element ko doosre element ke andar jodna

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
let currentFilter = "All";
let currentSubjectFilter = "All";
let allTasks = [];

// Yeh function saare tasks ko screen pe dikhata hai
function showAllTasks() {

  let container = document.getElementById("taskList");
  container.innerHTML = "";

  for (let i = 0; i < allTasks.length; i++) {

    let task = allTasks[i];

    // Pending/Done filter check
    if (currentFilter === "active" && task.completed === true) {
      continue;
    }
    if (currentFilter === "completed" && task.completed === false) {
      continue;
    }

    // Subject filter check
    if (currentSubjectFilter !== "All" && task.subject !== currentSubjectFilter) {
      continue;
    }

    let box = document.createElement("li");
    box.className = "task-card";

    box.innerHTML =
      '<div class="task-top-row">' +
        '<input type="checkbox" class="task-checkbox' + (task.completed ? ' checked-style' : '') + '" onclick="toggleComplete(' + i + ')" ' + (task.completed ? 'checked' : '') + '>'  +
        '<p class="task-name">' + task.name + '</p>' +
        '<button class="delete-btn" onclick="deleteTask(' + i + ')">🗑️</button>' +
      '</div>' +
      '<br>' +
      '<div class="task-bottom-row">' +
        task.subject + '  |   ' + task.priority + ' |  📅   ' + task.dueDate +
      '</div>';

    container.appendChild(box);
  }

  let emptyState = document.getElementById("emptyState");
  if (allTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  updateStats();
  updateProgressBar();
  renderSubjectButtons();
}

// Filter button click hone par yeh chalega (All / Pending / Done)
function setFilter(filterName) {
  currentFilter = filterName;
  showAllTasks();
}

// Subject filter button click hone par yeh chalega
function setSubjectFilter(subjectName) {
  currentSubjectFilter = subjectName;
  showAllTasks();
}

// Subject buttons ko dobara banata hai - sirf woh subjects jinka task bana hai
function renderSubjectButtons() {

  let subjectContainer = document.getElementById("subjectFilters");
  subjectContainer.innerHTML = "";

  // Pehle "All" button hamesha banao
  let allBtn = document.createElement("button");
  allBtn.className = "filter-btn";
  if (currentSubjectFilter === "All") {
    allBtn.className = "filter-btn active";
  }
  allBtn.textContent = "All";
  allBtn.onclick = function() {
    setSubjectFilter("All");
  };
  subjectContainer.appendChild(allBtn);

  // Ek khaali array - isme sirf unique subjects rakhenge
  let uniqueSubjects = [];

  for (let i = 0; i < allTasks.length; i++) {
    let subjectName = allTasks[i].subject;

    if (uniqueSubjects.includes(subjectName) === false) {
      uniqueSubjects.push(subjectName);
    }
  }

  // Ab har unique subject ka button banao
  for (let i = 0; i < uniqueSubjects.length; i++) {
    let subjectName = uniqueSubjects[i];

    let btn = document.createElement("button");
    btn.className = "filter-btn";
    if (currentSubjectFilter === subjectName) {
      btn.className = "filter-btn active";
    }
    btn.textContent = subjectName;
    btn.onclick = function() {
      setSubjectFilter(subjectName);
    };

    subjectContainer.appendChild(btn);
  }
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
  saveTasks(); 
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
  saveTasks(); 
  showAllTasks();
}

// Total, completed, pending, overdue count karke screen pe dikhao
function updateStats() {
  let total = allTasks.length;
  let completedCount = 0;
  let pendingCount = 0;
  let overdueCount = 0;

  let today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < allTasks.length; i++) {

    if (allTasks[i].completed === true) {
      completedCount = completedCount + 1;
    } else {
      pendingCount = pendingCount + 1;

      if (allTasks[i].dueDate !== "") {
        let taskDate = new Date(allTasks[i].dueDate);
        taskDate.setHours(0, 0, 0, 0);

        if (taskDate < today) {
          overdueCount = overdueCount + 1;
        }
      }
    }
  }

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statDone").textContent = completedCount;
  document.getElementById("statPending").textContent = pendingCount;
  document.getElementById("statOverdue").textContent = overdueCount;
}

// Progress bar update karne wala function
function updateProgressBar() {
  let total = allTasks.length;
  let completedCount = 0;

  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].completed === true) {
      completedCount = completedCount + 1;
    }
  }

  let percent = 0;
  if (total > 0) {
    percent = Math.round((completedCount / total) * 100);
  }

  document.getElementById("progressText").textContent = completedCount + " of " + total + " tasks done today";
  document.getElementById("progressPercent").textContent = percent + "%";
  document.getElementById("progressFill").style.width = percent + "%";
}

// Task delete karne ke liye
function deleteTask(index) {
  allTasks.splice(index, 1);
  saveTasks(); 
  showAllTasks();
}

// Clear done - sirf completed tasks hatao
function clearCompletedTasks() {

  let remainingTasks = [];

  for (let i = 0; i < allTasks.length; i++) {
    let task = allTasks[i];

    if (task.completed === false) {
      remainingTasks.push(task);
    }
  }

  allTasks = remainingTasks;
  saveTasks();
  showAllTasks();
}

// Jab user date select kare, days left calculate karo
function calculateDaysLeft() {
  let selectedDate = document.getElementById("boardDateInput").value;

  if (selectedDate === "") {
    return;
  }
  // Date ko localStorage mein save karo
  localStorage.setItem("boardDate", selectedDate);
  let today = new Date();
  let boardDate = new Date(selectedDate);

  today.setHours(0, 0, 0, 0);
  boardDate.setHours(0, 0, 0, 0);

  let differenceInTime = boardDate - today;
  let differenceInDays = Math.round(differenceInTime / (1000 * 60 * 60 * 24));

  document.getElementById("daysLeft").textContent = differenceInDays;
loadTasks();  
}

// ===== Button click events - sab functions define hone ke BAAD =====

document.getElementById("addBtn").onclick = addNewTask;
document.getElementById("clearCompletedBtn").onclick = clearCompletedTasks;
document.getElementById("boardDateInput").onchange = calculateDaysLeft;

// Page load hote hi list dikhao
showAllTasks();
function saveTasks() {
  localStorage.setItem("myTasks", JSON.stringify(allTasks));
}
function loadTasks() {
  let savedData = localStorage.getItem("myTasks");

  if (savedData !== null) {
    allTasks = JSON.parse(savedData);
  }
}
// JSON.parse(...) — text ko wapas array of objects mein convert kar deta hai (stringify ka opposite)
// if (savedData !== null) — agar pehli baar website khol rahe ho (kuch save hi nahi hua),
//  to yeh check zaroori hai, warna error aayega
function saveTasks() {
  localStorage.setItem("myTasks", JSON.stringify(allTasks));
}

function loadTasks() {
  let savedData = localStorage.getItem("myTasks");

  if (savedData !== null) {
    allTasks = JSON.parse(savedData);
  }
}
function loadBoardDate() {
  let savedDate = localStorage.getItem("boardDate");

  if (savedDate !== null) {
    document.getElementById("boardDateInput").value = savedDate;
    calculateDaysLeft();
  }
}
loadBoardDate(); 
loadTasks();  
showAllTasks(); 
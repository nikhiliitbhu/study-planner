//HTML DOM Objects
const daysToBoard = document.getElementById('daysLeft');
const taskName = document.getElementById('taskInput');
const taskTopic = document.getElementById('subjectSelect');
const taskDate = document.getElementById('dueDateInput');
const taskPriority = document.getElementById('prioritySelect');
const taskAdd = document.getElementById('addBtn');


//localstorage setting
const taskList = [];


//set number of days left to baord exam
const examDate = new Date("2026-07-25");
let numberOfDaysLeft = Math.ceil((examDate - new Date()) / (1000*3600*24));
daysToBoard.innerText = numberOfDaysLeft;


//Task Class Blueprint
class Task{
    constructor(name, topic, date, priority){
        this.name = name;
        this.topic = topic;
        this.date = date;
        this.priority = priority;
    }

    name;
    topic;
    date;
    priority;
}


//add task function
taskAdd.addEventListener('click', () => {
    
    //create task object with the help of blueprint
    let newTask = new Task(
        taskName.value, 
        taskTopic.value, 
        new Date(taskDate.value), 
        taskPriority.value);

    taskList.push(newTask);

    console.log(taskList);
})




// let sampleObject = new Task('calculus', 'physics', new Date('2026-07-01'), 'High');

// console.log(sampleObject);;
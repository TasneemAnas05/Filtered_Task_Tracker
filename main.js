let form = document.getElementById("form");
let task = document.getElementById("task");
let error = document.getElementById("error");
let tasks = document.getElementById("tasks");
let modeToggleCheckbox = document.getElementById("mode-toggle-checkbox");

let filterAllButton = document.getElementById("filter-all");
let filterDoneButton = document.getElementById("filter-done");
let filterInProgressButton = document.getElementById("filter-inprogress");

let currentFilter = "all";

let data = JSON.parse(localStorage.getItem("tasksData")) || [];

let saveData = () => {
  localStorage.setItem("tasksData", JSON.stringify(data));
  console.log("Data saved:", data);
};

let displayTasks = () => {
  tasks.innerHTML = "";

  const filteredData = data.filter((taskItem) => {
    if (currentFilter === "all") {
      return true;
    } else if (currentFilter === "done") {
      return taskItem.done === true;
    } else if (currentFilter === "inprogress") {
      return taskItem.done === false;
    }
    return true;
  });

  filteredData.forEach((taskItem, index) => {
    const originalIndex = data.findIndex((item) => item === taskItem);

    let newTaskDiv = document.createElement("div");
    newTaskDiv.innerHTML = `
                    <p>${taskItem.text}</p>
                    <span class="operation">
                        <button onclick="deleteTask(this, ${originalIndex})">Delete</button>
                        <button onclick="editTask(this, ${originalIndex})">Edit</button>
                        <button onclick="doneTask(this, ${originalIndex})">Done</button>
                    </span>
                `;
    tasks.appendChild(newTaskDiv);
    if (taskItem.done) {
      newTaskDiv.classList.add("done-task");
    }
  });
};

const applySavedTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    modeToggleCheckbox.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    modeToggleCheckbox.checked = false;
  }
};

applySavedTheme();
displayTasks();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (task.value.trim() === "") {
    error.innerHTML = "Please Enter a Task";
  } else {
    error.innerHTML = "";
    acceptData();
  }
};

let acceptData = () => {
  const newTask = {
    text: task.value.trim(),
    done: false,
  };

  data.push(newTask);
  saveData();
  displayTasks();
  task.value = "";
};

let deleteTask = (e, index) => {
  data.splice(index, 1);
  saveData();
  displayTasks();
};

let editTask = (e, index) => {
  task.value = data[index].text;
  data.splice(index, 1);
  saveData();
  displayTasks();
};
let doneTask = (e, index) => {
  data[index].done = !data[index].done;
  saveData();
  displayTasks();
};
const toggleMode = () => {
  if (modeToggleCheckbox.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
};
modeToggleCheckbox.addEventListener("change", toggleMode);

let showAllTasks = () => {
  currentFilter = "all";
  updateFilterButtons("filter-all");
  displayTasks();
};

let showDoneTasks = () => {
  currentFilter = "done";
  updateFilterButtons("filter-done");
  displayTasks();
};
let showInProgressTasks = () => {
  currentFilter = "inprogress";
  updateFilterButtons("filter-inprogress");
  displayTasks();
};
let updateFilterButtons = (activeButtonId) => {
  filterAllButton.classList.remove("active");
  filterDoneButton.classList.remove("active");
  filterInProgressButton.classList.remove("active");
  document.getElementById(activeButtonId).classList.add("active");
};

filterAllButton.addEventListener("click", showAllTasks);
filterDoneButton.addEventListener("click", showDoneTasks);
filterInProgressButton.addEventListener("click", showInProgressTasks);

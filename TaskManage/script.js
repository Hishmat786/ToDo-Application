let date = document.getElementsByClassName("date")[0];
let desc = document.getElementsByClassName("description")[0];
let task = document.getElementsByClassName("task")[0];
let priority = document.getElementsByClassName("priority")[0];
let todo = document.getElementById("todo");
let progress = document.getElementById("progress");
let done = document.getElementById("done");
let data = [];

window.addEventListener("load", () => {
  const storedTask = localStorage.getItem("Task");
  if (storedTask) {
    data = JSON.parse(storedTask);
    data.forEach(t => {
      addTaskToContainer(t);
    });
  }
});

const addTask = () => {
  const time = date.value;
  const dat = new Date(time);
  let timestring = dat.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    minute: "2-digit",
    hour: "2-digit",
    day: "numeric",
  });

  let obj = {
    id: Date.now(), 
    des: desc.value,
    tas: task.value,
    prior: priority.value,
    tim: timestring,
    status: 'todo'
  };

  data.push(obj);
  localStorage.setItem("Task", JSON.stringify(data));
  addTaskToContainer(obj);
  
  
    desc.value = ""
    task.value = ""
    priority.value = ""
    date.value = ""
  
  
};


const deleteTask = (id) => {
  data = data.filter(task => task.id !== id);
  localStorage.setItem("Task", JSON.stringify(data));
  renderTasks();
};

const renderTasks = () => {
  todo.innerHTML = "";
  progress.innerHTML = "";
  done.innerHTML = "";
  data.forEach(t => addTaskToContainer(t));
};

const addTaskToContainer = (task) => {
  const container = task.status === 'todo' ? todo :
                    task.status === 'progress' ? progress : done;
                    // console.log(container,task.status)
  const taskHTML = generatingHTML(task);
  container.innerHTML += taskHTML;
  addDragAndDropListeners();
};

const generatingHTML = (obj) => {
  const { id, des, prior, tas, tim } = obj;
  let className = "";

  switch (prior) {
    case "high":
      className = "bg-danger";
      break;
    case "medium":
      className = "bg-success";
      break;
    case "low":
      className = "bg-warning";
      break;
    default:
      className = "";
  }
  return `
    <div class="card" draggable="true" style="width: 20rem; margin-bottom: 15px" data-id="${id}">
      <div class="card-body">
        <div class="d-flex align-items-start gap-4">
          <span class="position-relative me-2">
            <span class="position-absolute end-99.5 translate-middle p-2 border border-light rounded-circle ${className}"></span>
          </span>
          <span class="position-relative">
            <span class="position-absolute translate-middle p-1 border border-light rounded-circle text-white circle" onclick="deleteTask(${id})">x</span>
          </span>
        </div><br>
        <h5 class="card-title">${tas}</h5>
        <p class="card-text">${des}</p>
        <h6 class="card-text">${tim}</h6>
      </div>
    </div>`;
};

const addDragAndDropListeners = () => {
  let cards = document.querySelectorAll('.card');
  let containers = [todo, progress, done];

  cards.forEach(card => {
    card.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', e.target.dataset.id);
    });

  });
  
  containers.forEach(container => {
    container.addEventListener('dragover', function(e) {
      e.preventDefault();
    });

    container.addEventListener('drop', function(e) {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const task = data.find(t => t.id == id);
      task.status = container.id;
      localStorage.setItem("Task", JSON.stringify(data));
      renderTasks();
    });
  });
};

addDragAndDropListeners();

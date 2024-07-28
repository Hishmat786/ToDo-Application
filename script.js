let date = document.getElementsByClassName("date");
let desc = document.getElementsByClassName("description")[0];
let task = document.getElementsByClassName("task")[0];
let priority = document.getElementsByClassName("priority")[0];
let todo = document.getElementsByClassName("consuming-data")[0];
let data = [];

window.addEventListener("load", () => {
  const storedTask = localStorage.getItem("Task");
  if (storedTask) {
    data = JSON.parse(storedTask);
    console.log(data);
    data.map((t) => {
      let oldData = generatingHTML(t);
      todo.innerHTML += oldData;
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

  const obj = {
    id: Date.now(), // unique id
    des: desc.value,
    tas: task.value,
    prior: priority.value,
    tim: timestring,
  };

  const TaskHTML = generatingHTML(obj);
  todo.innerHTML += TaskHTML;
  data = [...data, obj];

  localStorage.setItem("Task", JSON.stringify(data));

  obj = {
    des: "",
    tas: "",
    prior: "",
    tim: "",
  };
};

const deleteTask = (id) => {
  data = data.filter(task => task.id !== id);
  localStorage.setItem("Task", JSON.stringify(data));
  renderTasks();
};

const renderTasks = () => {
  todo.innerHTML = "";
  data.map((t) => {
    let oldData = generatingHTML(t);
    todo.innerHTML += oldData;
  });
};

const generatingHTML = (obj) => {
  const { id,des, prior, tas, tim } = obj;
  console.log(obj);
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
                <div class="card" style="width: 20rem; margin-bottom: 15px">
                    <div class="card-body">
                    <div class="d-flex align-items-start gap-4">
                        <span class="position-relative me-2">
                          <span class="position-absolute  end-99.5 translate-middle p-2 border border-light rounded-circle ${className}"></span>
                        </span>
                        <span class="position-relative">
                          <span class="position-absolute translate-middle p-1 border border-light rounded-circle text-white circle" onclick="deleteTask(${id})" >x</span>
                        </span>
                    </div><br>
                        <h5 class="card-title">${tas}</h5>
                        <p class="card-text">${des}</p>
                        <h6 class="card-text">${tim}</h6>
                    </div>
                </div>`;
};

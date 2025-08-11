class Task {
  constructor(id, title, level, msg, done = false) {
    this.id = id;
    this.title = title;
    this.level = level;
    this.msg = msg;
    this.done = done;
  }
}

const form = document.getElementById("form");
const tasksList = document.getElementById("tasksList");
let index = parseInt(localStorage.getItem("taskIndex")) || 0;
let tasks = [];

function renderTask(task) {
  const viewTask = document.createElement("div");
  viewTask.setAttribute("data-id", task.id);
  viewTask.classList.add("tarefa");
  if (task.done) viewTask.classList.add("clicado");

  // Define classes do ícone conforme estado
  const iconClasses = task.done ? "fa-solid fa-circle-check" : "fa-regular fa-circle";

  viewTask.innerHTML = `
    <li>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 2rem; margin-bottom:10px;">
        <i id="icone_${task.id}" onclick="checkedTask(${task.id})" class="${iconClasses}"></i>
        <h2 style="margin: 0;">${task.title}</h2>
        <i class="delete-btn fa-solid fa-trash" title="Deletar tarefa"></i>
      </div>
      <p>Descrição:</p>
      <p class="description">${task.msg}</p>
      <p class="text-difficulty">Dificuldade: <span>${task.level}</span></p>
    </li>
  `;
  tasksList.appendChild(viewTask);
}

function createTask(event) {
  event.preventDefault();
  const title = document.getElementById("title").value.trim();
  const level = document.getElementById("difficulty").value;
  const msg = document.getElementById("description").value.trim();

  if (!title || !level || !msg) {
    alert("Preencha todos os dados!");
    form.reset();
    return;
  }

  index++;
  localStorage.setItem("taskIndex", index);

  const task = new Task(index, title, level, msg, false);
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTask(task);
  form.reset();
}

tasksList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const taskDiv = event.target.closest(".tarefa");
    const taskId = parseInt(taskDiv.getAttribute("data-id"));

    taskDiv.remove();

    tasks = tasks.filter((t) => t.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

function checkedTask(taskId) {
  let item = document.querySelector(`[data-id="${taskId}"]`);
  if (!item) return;

  let icone = document.getElementById("icone_" + taskId);
  if (!icone) return;

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  if (task.done) {
    task.done = false;
    item.classList.remove("clicado");
    icone.classList.remove("fa-solid", "fa-circle-check");
    icone.classList.add("fa-regular", "fa-circle");
  } else {
    task.done = true;
    item.classList.add("clicado");
    icone.classList.remove("fa-regular", "fa-circle");
    icone.classList.add("fa-solid", "fa-circle-check");
    // Mover o item no DOM para o final do pai
    item.parentNode.appendChild(item);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

window.addEventListener("load", () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => renderTask(task));
});

form.addEventListener("submit", createTask);

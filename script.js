const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");
const greetButton = document.getElementById("greetButton");
const clearButton = document.getElementById("clearButton");
const result = document.getElementById("result");
const messageList = document.getElementById("messageList");

function showError(message) {
  result.textContent = message;
  result.classList.remove("success");
  result.classList.add("error");
}

function showSuccess(message) {
  result.textContent = message;
  result.classList.remove("error");
  result.classList.add("success");
}

function clearResult() {
  result.textContent = "";
  result.classList.remove("error");
  result.classList.remove("success");
}

function getMessages() {
  const savedMessages = localStorage.getItem("messages");

  if (savedMessages === null) {
    return [];
  }

  return JSON.parse(savedMessages);
}

function saveMessages(messages) {
  localStorage.setItem("messages", JSON.stringify(messages));
}

function deleteMessage(index) {
  const messages = getMessages();

  messages.splice(index, 1);

  saveMessages(messages);
  renderMessages();
}

function renderMessages() {
  const messages = getMessages();

  messageList.innerHTML = "";

  if (messages.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No recent messages yet.";
    emptyItem.classList.add("empty");

    messageList.appendChild(emptyItem);
    return;
  }

messages.forEach(function (message, index) {
  const listItem = document.createElement("li");

  const nameElement = document.createElement("strong");
  nameElement.textContent = message.name;

  const roleElement = document.createElement("span");
  roleElement.textContent = message.role;

  const dateElement = document.createElement("small");
  dateElement.textContent = message.createdAt ? message.createdAt : "No date";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("historyDeleteButton");

  deleteButton.addEventListener("click", function () {
    deleteMessage(index);
  });

  listItem.appendChild(nameElement);
  listItem.appendChild(roleElement);
  listItem.appendChild(dateElement);
  listItem.appendChild(deleteButton);

  messageList.appendChild(listItem);
});
}

const savedName = localStorage.getItem("name");
const savedRole = localStorage.getItem("role");

if (savedName && savedRole) {
  nameInput.value = savedName;
  roleInput.value = savedRole;

  showSuccess(`Welcome back, ${savedName}. Your role is ${savedRole}.`);
}

renderMessages();

greetButton.addEventListener("click", function () {
  const name = nameInput.value.trim();
  const role = roleInput.value.trim();

  if (name === "" || role === "") {
    showError("Please enter both your name and role.");
    return;
  }

  const messageText = `Welcome aboard, ${name}. Your role is ${role}.`;

  localStorage.setItem("name", name);
  localStorage.setItem("role", role);

  const messages = getMessages();

  messages.unshift({
    name: name,
    role: role,
    text: messageText
  });

  const latestMessages = messages.slice(0, 5);

  saveMessages(latestMessages);

  showSuccess(messageText);
  renderMessages();
});

clearButton.addEventListener("click", function () {
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  localStorage.removeItem("messages");

  nameInput.value = "";
  roleInput.value = "";

  clearResult();
  renderMessages();
});

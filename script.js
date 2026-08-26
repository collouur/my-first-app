const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");
const greetButton = document.getElementById("greetButton");
const clearButton = document.getElementById("clearButton");
const result = document.getElementById("result");
const messageList = document.getElementById("messageList");
let editingMessageId = null;

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

function deleteMessage(id) {
  const messages = getMessages();

  const updatedMessages = messages.filter(function (message) {
    return message.id !== id;
  });

  saveMessages(updatedMessages);
  renderMessages();
}

function startEditingMessage(message) {
  editingMessageId = message.id;

  nameInput.value = message.name;
  roleInput.value = message.role;

  greetButton.textContent = "Update message";

  showSuccess("Editing message. Change the fields and click Update message.");
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

messages.forEach(function (message) {
  const listItem = document.createElement("li");

  const nameElement = document.createElement("strong");
  nameElement.textContent = message.name;

  const roleElement = document.createElement("span");
  roleElement.textContent = message.role;

  const dateElement = document.createElement("small");
  dateElement.textContent = message.createdAt ? message.createdAt : "No date";

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("historyEditButton");

  editButton.addEventListener("click", function () {
    startEditingMessage(message);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("historyDeleteButton");

  deleteButton.addEventListener("click", function () {
    deleteMessage(message.id);
  });

  listItem.appendChild(nameElement);
  listItem.appendChild(roleElement);
  listItem.appendChild(dateElement);
  listItem.appendChild(editButton);
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

if (editingMessageId !== null) {
  const updatedMessages = messages.map(function (message) {
    if (message.id === editingMessageId) {
      return {
        ...message,
        name: name,
        role: role,
        text: messageText,
        updatedAt: new Date().toLocaleString()
      };
    }

    return message;
  });

  saveMessages(updatedMessages);

  clearResult();
  renderMessages();
  
  editingMessageId = null;
  greetButton.textContent = "Generate message";

  showSuccess("Message updated successfully.");
  renderMessages();

  return;
}

messages.unshift({
  id: Date.now(),
  name: name,
  role: role,
  text: messageText,
  createdAt: new Date().toLocaleString()
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

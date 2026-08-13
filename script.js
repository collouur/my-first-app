const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");
const greetButton = document.getElementById("greetButton");
const clearButton = document.getElementById("clearButton");
const result = document.getElementById("result");

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

const savedName = localStorage.getItem("name");
const savedRole = localStorage.getItem("role");

if (savedName && savedRole) {
  nameInput.value = savedName;
  roleInput.value = savedRole;

  showSuccess(`Welcome back, ${savedName}. Your role is ${savedRole}.`);
}

greetButton.addEventListener("click", function () {
  const name = nameInput.value.trim();
  const role = roleInput.value.trim();

  if (name === "" || role === "") {
    showError("Please enter both your name and role.");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("role", role);

  showSuccess(`Welcome aboard, ${name}. Your role is ${role}.`);
});

clearButton.addEventListener("click", function () {
  localStorage.removeItem("name");
  localStorage.removeItem("role");

  nameInput.value = "";
  roleInput.value = "";

  clearResult();
});

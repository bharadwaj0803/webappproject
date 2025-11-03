 const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend files

let users = []; // Temporary database

// Register API
app.post("/api/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ firstName, lastName, email, password });
  res.json({ message: "Registration successful!" });
});

// Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({ message: `Welcome back, ${user.firstName}!` });
});

// Serve main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Register & Login Tabs</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f3f4f6; display: flex; justify-content: center; align-items: center; height: 100vh; }
    .container { width: 350px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    .tabs { display: flex; border-bottom: 2px solid #ddd; }
    .tab { flex: 1; text-align: center; padding: 10px; cursor: pointer; font-weight: bold; }
    .tab.active { border-bottom: 3px solid blue; color: blue; }
    .form { margin-top: 15px; display: none; }
    .form.active { display: block; }
    input { width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 6px; }
    button { width: 100%; padding: 10px; background: blue; color: white; border: none; border-radius: 6px; cursor: pointer; }
    button:hover { background: darkblue; }
    .message { margin-top: 10px; font-weight: bold; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="tabs">
      <div id="registerTab" class="tab active">Register</div>
      <div id="loginTab" class="tab">Login</div>
    </div>

    <!-- Register Form -->
    <form id="registerForm" class="form active">
      <input type="text" id="firstName" placeholder="First Name" required />
      <input type="text" id="lastName" placeholder="Last Name" required />
      <input type="email" id="registerEmail" placeholder="Email" required />
      <input type="password" id="registerPassword" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>

    <!-- Login Form -->
    <form id="loginForm" class="form">
      <input type="email" id="loginEmail" placeholder="Email" required />
      <input type="password" id="loginPassword" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>

    <p class="message" id="message"></p>
  </div>

  <script>
    const registerTab = document.getElementById("registerTab");
    const loginTab = document.getElementById("loginTab");
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const message = document.getElementById("message");

    // Switch tabs
    registerTab.onclick = () => {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      registerForm.classList.add("active");
      loginForm.classList.remove("active");
      message.textContent = "";
    };

    loginTab.onclick = () => {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      loginForm.classList.add("active");
      registerForm.classList.remove("active");
      message.textContent = "";
    };

    // Register
    registerForm.onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      message.textContent = result.message;
    };

    // Login
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
      };

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      message.textContent = result.message;
    };
  </script>
</body>
</html>

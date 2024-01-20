const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();
const User = require("./models/userSchema");
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const bcrypt = require("bcrypt");

mongoose
  .connect("mongodb://127.0.0.1:27017/File-Management")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.get("/", async (req, res) => {
  return await res.render("signup");
});

app.get("/login", async (req, res) => {
  return await res.render("login");
});

app.post("/user/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  console.log(user);
  return res.render("multer");
});

// app.post("/user/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Assuming you have a User model
//     const user = await User.findOne({ email: email, password: password });

//     if (!user) {
//       return res.status(404).json({ message: "User Not Found" });
//     }

//     // Check if the provided password matches the stored password
//     if (user.password !== password) {
//       return res.status(401).json({ message: "Incorrect Password" });
//     }

//     // Password is correct, you can redirect/render the desired page
//     return res.render("multer");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email, password: password });
  if (!user) {
    return res.status(404).json({ message: " User Not Found" });
  }

  return res.render("multer");
});

// app.post("/user/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find a user with the provided email
//     const users = await User.find({ email: email });

//     // Check if a user with the given email exists
//     if (users.length === 0) {
//       return res.status(404).json({ message: "User Not Found" });
//     }

//     const user = users[0]; // Assuming you want the first user in the array

//     // Compare the provided password with the hashed password in the database
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: "Incorrect Password" });
//     }

//     // Password is correct, you can redirect/render the desired page
//     return res.render("multer");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

//File System

const fullPath = path.join(__dirname, "uploads");
const files = fs.readdirSync(fullPath);

try {
  files.forEach((file) => console.log(file));
} catch (error) {
  console.log(error);
}

/*MULTER PORTION*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("ProfileImage"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  console.log(upload.path);
  return res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`App is running on: localhost:${PORT}`);
});

module.exports;

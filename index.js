const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.get("/", (req, res) => {
  return res.render("signup");
});

app.listen(PORT, () => {
  console.log(`App is running on:locahost:${PORT}`);
});

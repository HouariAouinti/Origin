require("dotenv").config(); // to use the .env file
const express = require("express"); // to use express
const ejs = require("ejs"); // to use ejs
const mongoose = require("mongoose"); // to connect to the database
const encrypt = require("mongoose-encryption"); // to encrypt the password field
const app = express(); // creates an express app
const PORT = 3000; // port number

mongoose.connect("mongodb://127.0.0.1:27017/secrets"); // connects to the database

app.set("view engine", "ejs"); // to use ejs
app.use(express.urlencoded({ extended: true })); // to parse the body of the request
app.use(express.static("public")); // to serve static files

const userSchema = new mongoose.Schema({
  // creates a schema for the user
  email: String,
  password: String,
});

const secret = process.env.SECRET; // gets the secret from the .env file
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] }); // encrypts the password field

const user = mongoose.model("User", userSchema); // creates a collection named users

app.get("/", (req, res) => {
  // renders the home page
  res.render("home");
});

app.get("/login", (req, res) => {
  // renders the login page
  res.render("login");
});

app.get("/register", (req, res) => {
  // renders the register page
  res.render("register");
});

app.post("/register", (req, res) => {
  // registers the user
  const newUser = new user({
    // creates a new user
    email: req.body.username,
    password: req.body.password,
  });
  newUser
    .save() // saves the user to the database
    .then(() => {
      // renders the secrets page
      res.render("secrets");
    })
    .catch((err) => {
      // logs the error
      console.log(err);
    });
});

app.post("/login", (req, res) => {
  // logs in the user
  const username = req.body.username; // gets the username
  const password = req.body.password; // gets the password
  user
    .findOne({ email: username }) // finds the user
    .then((foundUser) => {
      // checks if the user exists
      if (foundUser) {
        // if the user exists
        if (foundUser.password === password) {
          // checks if the password is correct
          res.render("secrets"); // renders the secrets page
        }
      }
    })
    .catch((err) => {
      // logs the error
      console.log(err);
    });
});

app.listen(PORT, () => {
  // starts the server
  console.log(`Server is running on port ${PORT}`);
});

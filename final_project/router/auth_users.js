const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const users = users.filter((user) => username === user.name);
  return users.length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const registeredUser = users.find((user) => {
    return username === user.username && user.password === password;
  });
  return registeredUser ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    res.status(400).json({ message: "invalid username or password" });

  const isAuthenticated = authenticatedUser(username, password);

  if (isAuthenticated) {
    const token = jwt.sign({ username: username }, "token", {
      expiresIn: 60 * 60,
    });

    req.session.authorization = { username: username, token: token };

    return res
      .status(200)
      .json({ message: "successfully logged In", token: token });
  } else return res.status(401).json({ message: "unauthorized user" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization["username"];
  const review = req.body.review;
  const isbn = req.params.isbn;

  if (books[isbn] && review) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "review added" });
  } else
    return res.status(200).json({ message: "please provide a valid review" });
});

//delete the review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"];

  if (books[isbn]) {
    delete books[isbn].reviews[username];
    return res
      .status(200)
      .json({
        message: `review for username ${username} successfully deleted`,
      });
  } else res.status(404).json({ message: `book with ${isbn} not found` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//check if user is already registered
const alreadyExist = (username, password) => {
  const alreadyExist = users.find((user) => {
    return username === user.username;
  });

  return alreadyExist ? true : false;
};

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  let error;

  if (username && password) {
    if (!alreadyExist(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "successfully registered" });
    } else error = "already exists";
  } else error = "invalid username or password";

  return res.status(401).json({ message: error });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.send(JSON.stringify(books[isbn]));
  } else {
    res.status(404);
    res.send("The requested resource was not found");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let bookList = Object.entries(books);

  const selectedBooks = bookList.filter(([bookId, bookDetails]) => {
    return bookDetails.author === req.params.author;
  });

  if (selectedBooks.length > 0) {
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.send(JSON.stringify(selectedBooks));
  } else {
    return res.status(404).json({ message: "Author not Found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let bookList = Object.entries(books);

  const selectedBooks = bookList.filter(([bookId, bookDetails]) => {
    return bookDetails.title === req.params.title;
  });

  if (selectedBooks.length > 0) {
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.send(JSON.stringify(selectedBooks));
  } else {
    return res
      .status(404)
      .json({ message: `Book with title ${title} not found` });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    console.log(books[isbn]);
    res.send(JSON.stringify(books[isbn].reviews));
  } else {
    res.status(404);
    res.send("The requested resource was not found");
  }
});

//Task 10
//get all the books present already did this in task1 using promises or async await in axios

const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

public_users.get("/", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  getAllBooks()
    .then((books) => {
      res.status(200);
      res.send(books);
    })
    .catch((err) => {
      return res.status(404).json({ message: "resource not found" });
    });
});

//Task 11
// Search by ISBN – Using Promises already did it in task 2

const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    if (book[isbn]) resolve(book[isbn]);
    else reject(`book with ${isbn} doesn't exist`);
  });
};
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then((book) => {
      res.status(200);
      res.send(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

//Task 12
// Search by Author Using Promies already did it in task 3

const getAllBooksByAuthor = (author) => {
  let bookList = Object.entries(books);
  return new Promise((resolve, reject) => {
    const selectedBooks = bookList.filter(([bookId, bookDetails]) => {
      return bookDetails.author === author;
    });
    if (selectedBooks) resolve(selectedBooks);
    else reject("no books are found with particular author");
  });
};

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getAllBooksByAuthor(author)
    .then((books) => {
      res.status(200);
      res.send(books);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

//Task 13
// Search by Title using promises
const getAllBooksByTitle = (title) => {
  let bookList = Object.entries(books);
  return new Promise((resolve, reject) => {
    const selectedBooks = bookList.filter(([bookId, bookDetails]) => {
      return bookDetails.title === title;
    });
    if (selectedBooks.length > 0) resolve(selectedBooks);
    else reject(`books with title ${title} not found`);
  });
};

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  getAllBooksByTitle(title)
    .then((books) => {
      res.status(200);
      res.send(books);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

module.exports.general = public_users;
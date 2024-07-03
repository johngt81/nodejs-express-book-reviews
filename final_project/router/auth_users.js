const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const validUser = users.filter(user => user.username === username);
  return validUser.length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const loggedInUser = users.filter(user => user.username === username && user.password === password);
  return loggedInUser.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username, password)){
    const accessToken = jwt.sign({
      data: password
    }, "access", { expiresIn: 60 * 60 } );

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).json({message: "User logged in"});
  } else {
  return res.status(200).json({message: "User could not log in"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  const isbn = req.params.isbn;
  const review = req.body.review;

  const book = books[isbn];
  if (book){
    const update = {...book, review: review};
    books[isbn] = update;
    return res.status(200).json({message: "Book updated"});
  }

  return res.status(404).json({message: "Book not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const book = books[isbn];
  if (book){
    delete book.review;  
    return res.status(200).json({message: "Review deleted"});
  }

  return res.status(404).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

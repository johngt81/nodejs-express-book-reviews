const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password)
    return res.status(404).json({message: "Unable to register user"});

  if (isValid(username)){
      users.push({
        username: username,
        password: password
      });
      return res.status(200).json({message: "User registered"});
  } else {
    return res.status(404).json({message: "User already exists"});
  }
});


const getBookList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};

public_users.get('/', async function (req, res) {
  const books = await getBookList();
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 1000);
  });
};

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const book = await getBookByISBN(isbn);

  if (!book)
  {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).json(book);
 });
  
// Get book details based on author

const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Object.values(books).filter(book => book.author == author));
    }, 1000);
  });
};

public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  const bookFounds = await getBooksByAuthor(author);
  
  if (bookFounds.length > 0){
    return res.status(200).json(bookFounds);
  }
    return res.status(404).json({message: "Books not found"});
});

// Get all books based on title

const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Object.values(books).filter(book => book.title == title));
    }, 1000);
  });
};

public_users.get('/title/:title', async function (req, res) { 
  const title = req.params.title;
  const bookFounds = await getBooksByTitle(title);
  if (bookFounds.length > 0){
    return res.status(200).json(bookFounds);
  }
    return res.status(404).json({message: "Books not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book)
  {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;

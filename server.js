const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ---------------- DATABASE ----------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "library_db"
});

db.connect(err => {
  if (err) {
    console.log("DB Connection Failed");
  } else {
    console.log("DB Connected");
  }
});

// ---------------- BOOKS ----------------

// Add Book
app.post("/addBook", (req, res) => {
  const { title, author, quantity } = req.body;

  db.query(
    "INSERT INTO books (title, author, quantity) VALUES (?, ?, ?)",
    [title, author, quantity],
    (err) => {
      if (err) throw err;
      res.send("Book Added");
    }
  );
});

// Get Books
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Delete Book
app.delete("/deleteBook/:id", (req, res) => {
  db.query("DELETE FROM books WHERE id=?", [req.params.id], (err) => {
    if (err) throw err;
    res.send("Book Deleted");
  });
});

// ---------------- USERS ----------------

// Add User
app.post("/addUser", (req, res) => {
  const { name, email } = req.body;

  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err) => {
      if (err) throw err;
      res.send("User Added");
    }
  );
});

// Get Users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Delete User
 app.delete("/deleteUser/:id", (req, res) => {
  const id = req.params.id;

  console.log("DELETE REQUEST RECEIVED FOR ID:", id);

  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) throw err;

    console.log("USER DELETED FROM DB");
    res.send("User Deleted");
  });
});

// ---------------- ISSUE BOOK ----------------

app.post("/issueBook", (req, res) => {
  const { book_id, user_id } = req.body;

  db.query("SELECT quantity FROM books WHERE id=?", [book_id], (err, result) => {
    if (err) throw err;

    if (result.length > 0 && result[0].quantity > 0) {

      db.query(
        "INSERT INTO issued_books (book_id, user_id, status) VALUES (?, ?, 'issued')",
        [book_id, user_id]
      );

      db.query(
        "UPDATE books SET quantity = quantity - 1 WHERE id=?",
        [book_id]
      );

      res.send("Book Issued");

    } else {
      res.send("Book Not Available");
    }
  });
});

// ---------------- ISSUED BOOKS ----------------

app.get("/issuedBooks", (req, res) => {
  db.query(`
    SELECT issued_books.id, issued_books.book_id, books.title, users.name, issued_books.issue_date
    FROM issued_books
    JOIN books ON issued_books.book_id = books.id
    JOIN users ON issued_books.user_id = users.id
    WHERE issued_books.status = 'issued'
  `, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// ---------------- RETURN BOOK ----------------

app.post("/returnIssuedBook", (req, res) => {
  const { issue_id, book_id } = req.body;

  db.query(
    "UPDATE issued_books SET status='returned' WHERE id=?",
    [issue_id]
  );

  db.query(
    "UPDATE books SET quantity = quantity + 1 WHERE id=?",
    [book_id]
  );

  res.send("Book Returned");
});

// ---------------- SERVER START ----------------

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
 // 📘 Add Book
function addBook() {
  fetch("/addBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: document.getElementById("title").value,
      author: document.getElementById("author").value,
      quantity: document.getElementById("qty").value
    })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    loadBooks();
  });
}


// 📊 Load Books
function loadBooks() {
  fetch("/books")
    .then(res => res.json())
    .then(data => {
      let table = document.getElementById("bookTable");
      table.innerHTML = "";

      data.forEach(book => {
        table.innerHTML += `
          <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.quantity}</td>
            <td>
              <button onclick="deleteBook(${book.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}


// ❌ Delete Book
function deleteBook(id) {
  fetch("/deleteBook/" + id, {
    method: "DELETE"
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    loadBooks();
  });
}


// 👤 Add User
function addUser() {
  fetch("/addUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value
    })
  })
   .then(data => {
  alert(data);
  loadUsers(); 
});


// 🔄 Issue Book
function issueBook() {
  fetch("/issueBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      book_id: document.getElementById("bookId").value,
      user_id: document.getElementById("userId").value
    })
  })
   .then(data => {
  alert(data);
  loadBooks();
  loadIssuedBooks(); //  
})


// 🔄 Return Book
function returnBook() {
  fetch("/returnBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      book_id: document.getElementById("returnBookId").value
    })
  })
  .then(res => res.text())
  .then(alert);
    }}


// 🔍 Search
function searchBook() {
  let input = document.getElementById("search").value.toLowerCase();
  let rows = document.querySelectorAll("#bookTable tr");

  rows.forEach(row => {
    let title = row.children[1].innerText.toLowerCase();
    row.style.display = title.includes(input) ? "" : "none";
  });
}
 function loadUsers() {
  fetch("/users")
    .then(res => res.json())
    .then(data => {
      let table = document.getElementById("userTable");
      table.innerHTML = "";

      data.forEach(user => {
        table.innerHTML += `
          <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
              <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}
function deleteUser(id) {
  fetch("/deleteUser/" + id, {
    method: "DELETE"
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    loadUsers(); // refresh table
  });
}
function loadIssuedBooks() {
  fetch("/issuedBooks")
    .then(res => res.json())
    .then(data => {
      let table = document.getElementById("issuedTable");
      table.innerHTML = "";

      data.forEach(item => {
        table.innerHTML += `
          <tr>
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.name}</td>
            <td>${item.issue_date}</td>
            <td>
              <button onclick="returnBookFromTable(${item.id}, ${item.book_id})">Return</button>
            </td>
          </tr>
        `;
      });
    });
}


function returnBookFromTable(issueId, bookId) {
  fetch("/returnIssuedBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      issue_id: issueId,
      book_id: bookId
    })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    loadBooks();
    loadIssuedBooks();
  });
}
// 🚀 Auto load
window.onload = function() {
  loadBooks();
  loadUsers();
  loadIssuedBooks();  //  
}}
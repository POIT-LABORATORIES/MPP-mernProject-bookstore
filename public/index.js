function showOutput(el) {
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${el.title}</td>
    <td>${el.author}</td>
    <td>${el.pages}</td>
    <td>${el.isbn}</td>
    <td>
        <a href="/api/members/delete/${el.id}" 
           class="btn btn-danger btn-sm delete" 
           data-id="${el.id}">X</a>
    </td>
    `;

    document.getElementById("book-list").appendChild(row);
}

function showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector("#main-container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

function createItem(el) {
    let title = document.getElementById("book-title").value;
    let author = document.getElementById("book-author").value;
    let pages = document.getElementById("book-pages").value;
    let isbn = document.getElementById("book-isbn").value;

    axios.post('/api/members', {
        title,
        author,
        pages,
        isbn
      })
      .then(function (res) {
        showOutput(res.data);
        showAlert("Book is added", "success");
      })
      .catch(function (error) {
        console.log(error);
      });
}

function deleteItem(el) {
    let itemId = el.parentElement.querySelector("[data-id]").getAttribute("data-id");

    axios.delete("/api/members/delete/" + itemId)
    .then((res) => {showAlert("The book is deleted", "success");})
    .catch(err => console.error(err));

    el.parentElement.parentElement.remove();
}


// Event listeners.
document.querySelector("#book-list").addEventListener("click", (e) => {
    e.preventDefault();
    deleteItem(e.target);
});

document.getElementById("book-form").addEventListener("submit", (e) => {
    e.preventDefault();
    createItem(e.target.el);
});

document.getElementById("book-isbn").addEventListener('keyup', function() {
    this.value = this.value.replace(/[^\d-]/g, '');
});

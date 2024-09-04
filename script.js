document.addEventListener("DOMContentLoaded", function() {
    const bookListElement = document.getElementById("book-list");
    const searchInput = document.getElementById("search");
    const sortSelect = document.getElementById("sort");
    const filterButton = document.getElementById("filter");
    const paginationElement = document.getElementById("pagination");
    const errorMessageElement = document.getElementById("error-message");

    let books = [];
    let filteredBooks = [];
    let currentPage = 1;
    const booksPerPage = 6;

    // Fetch books from JSON
    function fetchBooks() {
        fetch('books.json') // Replace with your JSON file or API endpoint
            .then(response => response.json())
            .then(data => {
                books = data;
                filteredBooks = books;
                displayBooks();
                setupPagination();
            })
            .catch(error => {
                errorMessageElement.textContent = "Error fetching books. Please try again.";
            });
    }

    // Display books
    function displayBooks() {
        bookListElement.innerHTML = '';
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const booksToDisplay = filteredBooks.slice(startIndex, endIndex);

        booksToDisplay.forEach(book => {
            const bookItem = document.createElement("div");
            bookItem.classList.add("book-item");
            bookItem.innerHTML = `<h3>${book.title}</h3><p>${book.author}</p><p>${book.year}</p>`;
            bookListElement.appendChild(bookItem);
        });
    }

    // Setup pagination
    function setupPagination() {
        const pageCount = Math.ceil(filteredBooks.length / booksPerPage);
        paginationElement.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const pageItem = document.createElement("button");
            pageItem.textContent = i;
            if (i === currentPage) {
                pageItem.classList.add("active");
            }
            pageItem.addEventListener("click", function() {
                currentPage = i;
                displayBooks();
            });
            paginationElement.appendChild(pageItem);
        }
    }

    // Filter and sort books
    function filterAndSortBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;

        filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));

        if (sortBy === 'title') {
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'author') {
            filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
        } else if (sortBy === 'year') {
            filteredBooks.sort((a, b) => a.year - b.year);
        }

        currentPage = 1; // Reset to the first page
        displayBooks();
        setupPagination();
    }

    filterButton.addEventListener("click", filterAndSortBooks);

    fetchBooks();
});

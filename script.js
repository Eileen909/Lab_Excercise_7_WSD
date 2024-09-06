let booklist=[]
let currentPage=1
let itemsPerPage=5

const fetchbookss=document.querySelector('#fetchbooks')
let mainContainer=document.querySelector('#books-container')
let paginationcontainer=document.querySelector('#pagination-container')
let searchingInput=document.querySelector('#search')
let sortingItem=document.querySelector('#sorting')


fetchbookss.addEventListener('click', async () => {
    mainContainer.innerHTML = "<p>Loading books...</p>"; // Loading message
    try {
        const response = await fetch('https://api.nytimes.com/svc/books/v3/lists/2019-01-20/hardcover-fiction.json?api-key=QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b');
        if (!response.ok) throw new Error('Failed to fetch books');
        const data = await response.json();
        booklist = data.results.books;
        displayBooks();
    } catch (error) {
        mainContainer.innerHTML = `<p>Error fetching books: ${error.message}</p>`; // Display error message
    }
});


function displayBooks() {
    mainContainer.innerHTML = "";

    let filteredBooks = booklist.filter(book => book.title.toLowerCase().includes(searchingInput.value.toLowerCase()));

    if (filteredBooks.length === 0) {
        mainContainer.innerHTML = "<p>No books found</p>"; // Display message if no books match the search
        paginationcontainer.innerHTML = "";
        return;
    }

    if (sortingItem.value === 'asc') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
    }

    let paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    paginatedBooks.forEach(book => {
        let bookimg = document.createElement('img');
        bookimg.src = book.book_image;
        bookimg.height = 100;
        bookimg.width = 100;

        let title = document.createElement('div');
        title.textContent = book.title;

        let description = document.createElement('div');
        description.textContent = book.description;

        let container = document.createElement('div');
        container.appendChild(bookimg);
        container.appendChild(title);
        container.appendChild(description);
        mainContainer.appendChild(container);
    });

    displayPagination(filteredBooks.length);
}


searchingInput.addEventListener('input',()=>{
    currentPage=1
    displayBooks()
})

sortingItem.addEventListener('change',()=>{
    displayBooks()
})

function displayPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationcontainer = document.querySelector('#pagination-container');
    paginationcontainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayBooks();
        });
        paginationcontainer.appendChild(pageButton);
    }
}
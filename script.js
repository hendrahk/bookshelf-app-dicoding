const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "bookshelf-apps";

document.addEventListener('DOMContentLoaded', () => {
    const inputBook = document.getElementById('inputBook');

    inputBook.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    });

    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit', (e) =>{
        e.preventDefault();
        cariBuku();
    })

    if(isStorageExist()){
        loadDataFromStorage();
    };
});

const addBook = () => {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete');
    let bookStatus;
    

    if(bookIsComplete.checked){
        bookStatus = true;
    } else {
        bookStatus = false;
    };

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, bookStatus)

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const generateId = () => {
    return +new Date();
};

const generateBookObject = (id, bookTitle, bookAuthor, bookYear, isCompleted) => {
    return{
        id,
        bookTitle,
        bookAuthor,
        bookYear,
        isCompleted
    }
};

const makeBook = (bookObject) => {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = `${bookObject.bookTitle}`;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = `Penulis : ${bookObject.bookAuthor}`;

    const bookYear = document.createElement('p');
    bookYear.innerText = `Tahun : ${bookObject.bookYear}`;

    const container = document.createElement('article');
    container.classList.add("book_item");
    container.append(bookTitle, bookAuthor, bookYear);
    container.setAttribute('id', `book-${bookObject.id}`);

    if(bookObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('btn', 'btn-primary');
        undoButton.innerHTML = "<a> Kembalikan </a>";

        undoButton.addEventListener('click', () => {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('btn', 'btn-danger');
        trashButton.innerHTML = "<a> Hapus </a>";

        trashButton.addEventListener('click', () => {
            removeBookFromCompleted(bookObject.id);
            const notifHapus = document.getElementById('notifHapus');
            notifHapus.removeAttribute('hidden');
            
            setTimeout(() => {
                notifHapus.setAttribute('hidden', true);
            }, 3000);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button')
            checkButton.classList.add('btn', 'btn-success');
            checkButton.innerHTML = "<a> Selesai </a>";

            checkButton.addEventListener('click', () => {
                addBookToCompleted(bookObject.id);
            });
            container.append(checkButton);
        }
        return container;
};

const addBookToCompleted = (bookId) => {
    const bookTarget = findBook(bookId);

    if(bookTarget == null){
        return;
    }

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

const findBook = (bookId) => {
    for(const book_item of books){
        if(book_item.id === bookId){
            return book_item;
        };
    }
    return null;
};

document.addEventListener(RENDER_EVENT, () => {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = "";

    for(const bookItem of books){
        const bookElement = makeBook(bookItem);

        if(!bookItem.isCompleted && bookItem.isCompleted !== 0){
            // const rakBukuBelumSelesai = document.querySelector('#belumSelesaiDibaca');
            // rakBukuBelumSelesai.removeAttribute('hidden');
            uncompletedBookList.append(bookElement);
        }else if (bookItem.isCompleted && bookItem.isCompleted !== 0){
            // const rakBukuSelesai = document.getElementById('selesaiDibaca');
            // rakBukuSelesai.removeAttribute('hidden');
            completedBookList.append(bookElement);
        }
    }
});

const removeBookFromCompleted = (bookId) => {
    const bookTarget = findBookIndex(bookId);

    if(bookTarget === -1){
        return;
    }

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

const undoBookFromCompleted = (bookId) => {
    const bookTarget = findBook(bookId);

    if(bookTarget === null){
        return;
    }

    bookTarget.isCompleted = false;

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

const findBookIndex = (bookId) => {
    for (const index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

const saveData = () => {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

const isStorageExist = () => {
    if(typeof Storage === undefined){
        alert("browser tidak supp nih kak");
        return false
    }
    return true;
};

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
    const notif = document.getElementById('notif');
    notif.removeAttribute('hidden');
    
    setTimeout(() => {
        notif.setAttribute('hidden', true);
    }, 3000);
});

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null){
        for (const book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
};

const cariBuku = () => {
    const keywordBook = document.getElementById('searchBookTitle').value.toLowerCase();

    // console.log(keywordBook);

    const bookList = document.querySelectorAll('h3');
    const elementSearchBook = document.getElementById('cariBuku');

    console.log(bookList);

    for(const book of bookList){
        if(book.innerHTML.toLowerCase().includes(keywordBook)){
            const bukuDitemukan = document.createElement('h3');
            bukuDitemukan.innerText = keywordBook;
            elementSearchBook.append(bukuDitemukan);
        } else {
            const bukuDitemukan = document.createElement('h3');
            bukuDitemukan.innerText = "buku tidak ditemukan";
            elementSearchBook.append(bukuDitemukan);

            setTimeout(() => {
                bukuDitemukan.remove();
            },2000)
        };
    }

};
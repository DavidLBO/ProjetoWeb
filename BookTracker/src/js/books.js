const BookManager = {
    books: [],

    addBook(book) {
        book.id = Date.now().toString();
        this.books.push(book);
        return book;
    },

    getBooksByUser(userId) {
        return this.books.filter(book => book.userId === userId);
    },

    removeBook(bookId) {
        this.books = this.books.filter(book => book.id !== bookId);
    },

    // Modificado: agora retorna os livros sem ordenação
    getBooksByCategory(userId, category) {
        return this.getBooksByUser(userId)
            .filter(book => book.category === category);
    },

    // Novo método: aplica a ordenação
    sortBooks(books, sortBy) {
        return [...books].sort((a, b) => {
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            } else {
                return b.rating - a.rating;
            }
        });
    }
};
const DOM = {
    app: document.getElementById('app'),

    renderHeader() {
        return `
            <header>
                <h1>Book Tracker</h1>
                <p>Acompanhe os livros que você já leu, está lendo ou quer ler!</p>
            </header>
        `;
    },

    renderAuthSection() {
        if (Auth.isAuthenticated()) {
            return `
                <div class="auth-section">
                    <p>Bem-vindo, <strong>${Auth.currentUser.username}</strong>!</p>
                    <button id="logout-btn">Sair <i class="fas fa-sign-out-alt"></i></button>
                </div>
            `;
        }

        return `
            <div class="auth-section">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Entrar</button>
                    <button class="auth-tab" data-tab="register">Registrar</button>
                </div>
                
                <div class="auth-content active" id="login-content">
                    <form class="auth-form" id="login-form">
                        <div class="form-group">
                            <input type="text" placeholder="Nome de usuário" id="login-username" required>
                        </div>
                        <div class="form-group">
                            <input type="password" placeholder="Senha" id="login-password" required>
                        </div>
                        <button type="submit">Entrar <i class="fas fa-sign-in-alt"></i></button>
                    </form>
                </div>
                
                <div class="auth-content" id="register-content">
                    <form class="auth-form" id="register-form">
                        <div class="form-group">
                            <input type="text" placeholder="Novo usuário" id="register-username" required>
                        </div>
                        <div class="form-group">
                            <input type="password" placeholder="Nova senha" id="register-password" required>
                        </div>
                        <button type="submit">Registrar <i class="fas fa-user-plus"></i></button>
                    </form>
                </div>
            </div>
        `;
    },

    renderNavigation() {
        return `
            <nav>
                <button data-view="list">Ver Livros</button>
                <button data-view="add">Adicionar Livro</button>
            </nav>
        `;
    },

    renderAddBookForm() {
        return `
            <form class="book-form" id="book-form">
                <div class="form-group">
                    <label for="title">Título do Livro</label>
                    <input type="text" id="title" required>
                </div>
                <div class="form-group">
                    <label for="author">Autor</label>
                    <input type="text" id="author" required>
                </div>
                <div class="form-group">
                    <label for="category">Categoria</label>
                    <select id="category" required>
                        <option value="read">Já li</option>
                        <option value="reading">Lendo</option>
                        <option value="want-to-read">Quero ler</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Avaliação</label>
                    <div class="stars" id="rating-stars">
                        <i class="fas fa-star" data-rating="1"></i>
                        <i class="fas fa-star" data-rating="2"></i>
                        <i class="fas fa-star" data-rating="3"></i>
                        <i class="fas fa-star" data-rating="4"></i>
                        <i class="fas fa-star" data-rating="5"></i>
                    </div>
                    <input type="hidden" id="rating" value="0" required>
                </div>
                <div class="form-group">
                    <label for="review">Resenha (Opcional)</label>
                    <textarea id="review"></textarea>
                </div>
                <button type="submit">Adicionar Livro</button>
            </form>
        `;
    },

    renderBookList() {
        if (!Auth.isAuthenticated()) {
            return '<p>Por favor, faça login para ver seus livros.</p>';
        }

        const userId = Auth.currentUser.id;
        const sortBy = document.getElementById('sort-by')?.value || 'rating';

        const readBooks = BookManager.getBooksByCategory(userId, 'read');
        const readingBooks = BookManager.getBooksByCategory(userId, 'reading');
        const wantToReadBooks = BookManager.getBooksByCategory(userId, 'want-to-read');

        const sortedReadBooks = BookManager.sortBooks(readBooks, sortBy);
        const sortedReadingBooks = BookManager.sortBooks(readingBooks, sortBy);
        const sortedWantToReadBooks = BookManager.sortBooks(wantToReadBooks, sortBy);

        return `
            <div class="sort-options">
                <label for="sort-by">Ordenar por:</label>
                <select id="sort-by">
                    <option value="rating" ${sortBy === 'rating' ? 'selected' : ''}>Avaliação (Maior para menor)</option>
                    <option value="title" ${sortBy === 'title' ? 'selected' : ''}>Título (A-Z)</option>
                </select>
            </div>
            <h2>Já li</h2>
            <div class="books-container" id="read-books">
                ${sortedReadBooks.length ? sortedReadBooks.map(book => this.renderBookCard(book)).join('') : '<p>Nenhum livro nesta categoria ainda.</p>'}
            </div>
            
            <h2>Lendo</h2>
            <div class="books-container" id="reading-books">
                ${sortedReadingBooks.length ? sortedReadingBooks.map(book => this.renderBookCard(book)).join('') : '<p>Nenhum livro nesta categoria ainda.</p>'}
            </div>
            
            <h2>Quero ler</h2>
            <div class="books-container" id="want-to-read-books">
                ${sortedWantToReadBooks.length ? sortedWantToReadBooks.map(book => this.renderBookCard(book)).join('') : '<p>Nenhum livro nesta categoria ainda.</p>'}
            </div>
        `;
    },

    renderBookCard(book) {
        const categoryClass = book.category === 'read' ? 'read' :
            book.category === 'reading' ? 'reading' : 'want-to-read';
        const categoryText = book.category === 'read' ? 'Já li' :
            book.category === 'reading' ? 'Lendo' : 'Quero ler';

        return `
            <div class="book-card" data-id="${book.id}">
                <span class="category ${categoryClass}">${categoryText}</span>
                <h3>${book.title}</h3>
                <p><em>por ${book.author}</em></p>
                <div class="rating">
                    ${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}
                </div>
                ${book.review ? `<div class="review"><p>${book.review}</p></div>` : ''}
                <button class="delete-btn">Excluir</button>
            </div>
        `;
    },

    


    render(view) {
        let content = '';

        if (view === 'add') {
            content = this.renderAddBookForm();
        } else {
            content = this.renderBookList();
        }

        this.app.innerHTML = `
            ${this.renderHeader()}
            ${this.renderAuthSection()}
            ${this.renderNavigation()}
            ${content}
        `;

        this.setupEventListeners();
    },

    setupEventListeners() {
        // 1. Navegação entre views (Lista/Adicionar)
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.getAttribute('data-view');
                App.navigateTo(view);
            });
        });

        // 2. Sistema de abas de autenticação (Login/Register)
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Remover classe active de todas as abas e conteúdos
                document.querySelectorAll('.auth-tab, .auth-content').forEach(el => {
                    el.classList.remove('active');
                });

                // Ativar aba e conteúdo clicados
                const tabId = e.target.getAttribute('data-tab');
                e.target.classList.add('active');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });

        // 3. Formulário de Login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                const result = Auth.login(username, password);

                if (result.success) {
                    App.navigateTo('list');
                } else {
                    alert(result.message);
                }
            });
        }

        // 4. Formulário de Registro
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('register-username').value;
                const password = document.getElementById('register-password').value;
                const result = Auth.register(username, password);

                if (result.success) {
                    alert('Registrado com sucesso! Por favor, faça login.');
                    // Ativa a aba de login após registro
                    document.querySelectorAll('.auth-tab, .auth-content').forEach(el => {
                        el.classList.remove('active');
                    });
                    document.querySelector('[data-tab="login"]').classList.add('active');
                    document.getElementById('login-content').classList.add('active');
                } else {
                    alert(result.message);
                }
            });
        }

        // 5. Botão de Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.logout();
                App.navigateTo('list');
            });
        }

        // 6. Formulário de Livros
        const bookForm = document.getElementById('book-form');
        if (bookForm) {
            // Sistema de avaliação por estrelas
            const stars = document.querySelectorAll('#rating-stars i');
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const rating = parseInt(star.getAttribute('data-rating'));
                    document.getElementById('rating').value = rating;

                    stars.forEach((s, index) => {
                        if (index < rating) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                });
            });

            bookForm.addEventListener('submit', (e) => {
                e.preventDefault();

                if (!Auth.isAuthenticated()) {
                    alert('Faça login para adicionar livros.');
                    return;
                }

                const title = document.getElementById('title').value;
                const author = document.getElementById('author').value;
                const category = document.getElementById('category').value;
                const rating = parseInt(document.getElementById('rating').value);
                const review = document.getElementById('review').value;

                if (rating === 0) {
                    alert('Por favor, escolha uma avaliação.');
                    return;
                }

                const book = {
                    title,
                    author,
                    category,
                    rating,
                    review,
                    userId: Auth.currentUser.id
                };

                BookManager.addBook(book);
                App.navigateTo('list');
            });
        }

        // 7. Botões de deletar livros
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!Auth.isAuthenticated()) return;

                const bookId = e.target.closest('.book-card').getAttribute('data-id');
                BookManager.removeBook(bookId);
                App.navigateTo('list');
            });
        });

        // 8. Sistema de ordenação
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                // Apenas re-renderiza a lista atual
                if (App.currentView === 'list') {
                    DOM.render('list');
                }
            });
        }
    }
};
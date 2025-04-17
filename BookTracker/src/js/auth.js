const Auth = {
    currentUser: null,
    users: [],

    register(username, password) {
        if (this.users.find(user => user.username === username)) {
            return { success: false, message: 'Usuário já existe' };
        }

        const user = { username, password, id: Date.now().toString() };
        this.users.push(user);
        return { success: true, user };
    },

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            return { success: false, message: 'Credenciais inválidas' };
        }
        this.currentUser = user;
        return { success: true, user };
    },

    logout() {
        this.currentUser = null;
        return { success: true };
    },

    isAuthenticated() {
        return !!this.currentUser;
    }
};
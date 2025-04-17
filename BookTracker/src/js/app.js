const App = {
    currentView: 'list',

    init() {
        this.navigateTo(this.currentView);
    },

    navigateTo(view) {
        this.currentView = view;
        DOM.render(view);
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => App.init());
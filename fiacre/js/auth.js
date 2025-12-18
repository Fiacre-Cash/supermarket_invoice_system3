const defaultUsers = [
    { username: 'admin', password: 'admin123', role: 'admin', fullName: 'Administrator' },
    { username: 'cashier', password: '1234', role: 'cashier', fullName: 'Cashier User' }
];

function initializeUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
}

function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const currentUser = {
            username: user.username,
            role: user.role,
            fullName: user.fullName
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    }
    
    return { success: false, message: 'Invalid username or password' };
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function checkAuth(requiredRole = null) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'index.html';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        alert('Access denied. You do not have permission to access this page.');
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        return false;
    }
    
    return true;
}

function displayUserInfo() {
    const user = getCurrentUser();
    const userInfoElement = document.getElementById('userInfo');
    
    if (user && userInfoElement) {
        userInfoElement.textContent = `${user.fullName} (${user.role})`;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/fiacre/')) {
    initializeUsers();
    
    const currentUser = getCurrentUser();
    if (currentUser) {
        if (currentUser.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            const result = loginUser(username, password);
            
            if (result.success) {
                if (result.user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                alert(result.message);
            }
        });
    }
}

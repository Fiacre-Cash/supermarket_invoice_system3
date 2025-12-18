let editMode = false;

function loadTeam() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tbody = document.getElementById('teamTableBody');
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td><span class="badge ${user.role === 'admin' ? 'badge-success' : 'badge-warning'}">${user.role}</span></td>
            <td><span class="badge badge-success">Active</span></td>
            <td>
                <div class="btn-group">
                    ${user.role !== 'admin' ? `
                        <button class="btn btn-sm btn-primary" onclick="editUser('${user.username}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.username}')">Delete</button>
                    ` : '<span class="text-muted">System Admin</span>'}
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddUserModal() {
    editMode = false;
    document.getElementById('modalTitle').textContent = 'Add Cashier';
    document.getElementById('userForm').reset();
    document.getElementById('editUsername').value = '';
    document.getElementById('username').disabled = false;
    document.getElementById('userModal').classList.add('active');
}

function editUser(username) {
    editMode = true;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username);
    
    if (user) {
        document.getElementById('modalTitle').textContent = 'Edit Cashier';
        document.getElementById('editUsername').value = user.username;
        document.getElementById('username').value = user.username;
        document.getElementById('username').disabled = true;
        document.getElementById('fullName').value = user.fullName;
        document.getElementById('password').required = false;
        document.getElementById('confirmPassword').required = false;
        document.getElementById('userModal').classList.add('active');
    }
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
    document.getElementById('userForm').reset();
    document.getElementById('password').required = true;
    document.getElementById('confirmPassword').required = true;
}

function deleteUser(username) {
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.username !== username);
        localStorage.setItem('users', JSON.stringify(users));
        loadTeam();
        alert('User deleted successfully!');
    }
}

document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords if provided
    if (password && password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Validate password strength
    if (password && password.length < 4) {
        alert('Password must be at least 4 characters long!');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (editMode) {
        // Update existing user
        const editUsername = document.getElementById('editUsername').value;
        const userIndex = users.findIndex(u => u.username === editUsername);
        
        if (userIndex !== -1) {
            users[userIndex].fullName = fullName;
            if (password) {
                users[userIndex].password = password;
            }
            localStorage.setItem('users', JSON.stringify(users));
            alert('User updated successfully!');
        }
    } else {
        // Check if username already exists
        if (users.find(u => u.username === username)) {
            alert('Username already exists!');
            return;
        }
        
        // Add new cashier
        const newUser = {
            username,
            password,
            role: 'cashier',
            fullName
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Cashier added successfully!');
    }
    
    closeUserModal();
    loadTeam();
});

// Load team on page load
loadTeam();

// Initialize the database if it doesn't exist
function initDatabase() {
    if (!localStorage.getItem('exnessUsers')) {
        localStorage.setItem('exnessUsers', JSON.stringify([]));
    }
    if (!localStorage.getItem('accountBalance')) {
        localStorage.setItem('accountBalance', '500.00');
    }
}

// Add a new user
function addUser(userData) {
    const users = JSON.parse(localStorage.getItem('exnessUsers'));
    userData.id = Date.now(); // Simple unique ID
    userData.balance = '500.00'; // Initial balance
    userData.createdAt = new Date().toISOString();
    users.push(userData);
    localStorage.setItem('exnessUsers', JSON.stringify(users));
    return userData;
}

// Find user by email
function findUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('exnessUsers'));
    return users.find(user => user.email === email);
}

// Update user data
function updateUser(email, newData) {
    const users = JSON.parse(localStorage.getItem('exnessUsers'));
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex > -1) {
        users[userIndex] = { ...users[userIndex], ...newData };
        localStorage.setItem('exnessUsers', JSON.stringify(users));
        return users[userIndex];
    }
    return null;
}

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Log in user
function loginUser(email) {
    const user = findUserByEmail(email);
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

// Log out user
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Initialize the database when this file loads
initDatabase();
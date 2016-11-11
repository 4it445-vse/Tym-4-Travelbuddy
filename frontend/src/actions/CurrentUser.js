var currentUser = undefined;

function getCurrentUser() {
    if (!currentUser) {
        console.log("loaded from localStorage");
        currentUser = JSON.parse(localStorage.getItem('user'));
    }
    return currentUser;
}

function setCurrentUser(user) {
    currentUser = user;
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
}

export default {
    getCurrentUser,
    setCurrentUser
}
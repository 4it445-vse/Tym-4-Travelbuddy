var currentUser = undefined;

function getCurrentUser() {
    if (!currentUser) {
        console.log("tried to load from sessionStorage");
        currentUser = JSON.parse(sessionStorage.getItem('user'));
        if (!currentUser) {
            console.log("tried to load from localStorage");
            currentUser = JSON.parse(localStorage.getItem('user'));
        }
    }
    return currentUser;
}

function setCurrentUser(user, rememberUser) {
    currentUser = user;
    if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        if (rememberUser) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    } else {
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
    }
}

export default {
    getCurrentUser,
    setCurrentUser
}
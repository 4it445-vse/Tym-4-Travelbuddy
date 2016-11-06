var currentUser = undefined;

var logIn = "undefined";

function logIn() {
    logIn();
}

function setLogIn(fn) {
    logIn = fn;
}

function getCurrentUser() {
    if (!currentUser) {
        console.log("loaded from localStorage");
        currentUser = JSON.parse(localStorage.getItem('user'));
    }
    return currentUser;
}

function setCurrentUser(user) {
    if (!!user) {
        currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
}

export default {
    getCurrentUser,
    setCurrentUser,
    logIn,
    setLogIn
}
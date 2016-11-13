var currentUser = undefined;
var openLogInFn;

function openLogIn(){
    openLogInFn();
}

function setOpenLogInFn(fn){
    openLogInFn = fn;
}

function getCurrentUser() {
    if (!currentUser) {
        console.log("tried to load from remembered user");
        currentUser = JSON.parse(sessionStorage.getItem('user'));
        if (!currentUser) {
            console.log("tried to load from normal user");
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
    setCurrentUser,
    openLogIn,
    setOpenLogInFn
}

var currentUser = "undefined";

var logIn = "undefined";

function logIn(){
    logIn();
}

function setLogIn(fn){
    logIn = fn;
}

function getCurrentUser(){
    console.log(currentUser);
    return currentUser;
}

function setCurrentUser(user){
    console.log(user);
    currentUser = user;
}

export default {
    getCurrentUser,
    setCurrentUser,
    logIn,
    setLogIn
}
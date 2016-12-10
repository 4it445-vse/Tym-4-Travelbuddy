import axios from "../api";

var currentUser = undefined;
var openLogInFn;
var openProfilefn;
var openContactBuddyFn;
var alert;
var question;

function getQuestion(){
    return question;
}

function setQuestion(al){
    question = al;
}

function getAlert(){
    return alert;
}

function setAlert(al){
    alert = al;
}

function setAuthToken(token){
    if(token){
        sessionStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = token;
    }else{
        localStorage.removeItem('token');
    }
}

function loadAuthToken(){
    var token = sessionStorage.getItem('token');
    if(token){
        axios.defaults.headers.common['Authorization'] = token;
    }
}

function openLogIn(){
    openLogInFn();
}

function setOpenLogInFn(fn){
    openLogInFn = fn;
}

function openProfile(selectedBuddy, showContactButton){
    openProfilefn(selectedBuddy, showContactButton);
}

function setOpenProfilefn(fn){
    openProfilefn = fn;
}

function openContactBuddy(selectedBuddy){
    openContactBuddyFn(selectedBuddy);
}

function setOpenContactBuddy(fn){
    openContactBuddyFn = fn;
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
    setOpenLogInFn,
    setAuthToken,
    loadAuthToken,
    getAlert,
    setAlert,
    getQuestion,
    setQuestion,
    setOpenProfilefn,
    openProfile,
    openContactBuddy,
    setOpenContactBuddy
}
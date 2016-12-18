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
        currentUser = JSON.parse(sessionStorage.getItem('user'));
        if (!currentUser) {
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

function updateCurrentUser(user) {
    currentUser = user;
    var sessUser = JSON.parse(sessionStorage.getItem('user'));
    if (sessUser) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }else{
        let lsUser = JSON.parse(localStorage.getItem('user'));
        if (lsUser) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }
}

function composeProfilePhotoName(buddy){
    const profilePhotoName = buddy.profile_photo_name;
    if (profilePhotoName) {
        const containerName = 'container_' + buddy.id;
        return  '/api/containers/' + containerName + '/download/' + profilePhotoName;
    }else{
        return 'http://images.megaupload.cz/mystery-man.png';
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
    setOpenContactBuddy,
    updateCurrentUser,
    composeProfilePhotoName
}
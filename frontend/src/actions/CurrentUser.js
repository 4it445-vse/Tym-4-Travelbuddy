import axios from "../api";

var refreshMessagesFn = undefined;

function setRefreshMessagesFn(fn) {
    refreshMessagesFn = fn;
}

function refreshMessages(data) {
    refreshMessagesFn(data);
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

function composeProfilePhotoName(buddy, cb){
    const profilePhotoName = buddy.profile_photo_name;
    if (profilePhotoName) {
        const containerName = 'container_' + buddy.id;
        let path = '/api/containers/' + containerName + '/download/' + profilePhotoName;
        let client = new XMLHttpRequest();
        client.open('GET', path);
        console.log("in will be send");
        client.onreadystatechange = () => {
            cb(client.responseText);
        }
        client.send();
    }else{
        cb('http://images.megaupload.cz/mystery-man.png');
    }
}

const dateFormat = "MM/DD/YYYY";

export default {
    setAuthToken,
    loadAuthToken,
    composeProfilePhotoName,
    setRefreshMessagesFn,
    refreshMessages,
    dateFormat
}
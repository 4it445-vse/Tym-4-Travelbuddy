import axios from "../api";

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
    setAuthToken,
    loadAuthToken,
    composeProfilePhotoName
}
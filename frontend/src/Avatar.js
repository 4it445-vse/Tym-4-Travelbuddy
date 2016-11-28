import axios from "axios";

export default function getAvatar(userId) {
    axios.get('/get-avatar?userId=' + userId).then(function(response){
        console.log(response);
        return response.avatarUrl;
    });
}
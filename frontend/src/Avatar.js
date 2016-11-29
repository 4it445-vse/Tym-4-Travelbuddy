import axios from "axios";

export default function getAvatar(userId) {
    axios.get('/get-avatar?userId=' + userId).then(function(response){
        console.log("User id: ", response.data.avatarUrl);
        return response.data.avatarUrl;
    });
}
import io from "socket.io-client";
import currentUser from "../actions/CurrentUser";

function newMessage(buddy_id){
  var socket = io.connect('http://localhost:3000');
  socket.emit('identify', buddy_id);
  socket.on('newMessage', function (data){
      currentUser.refreshMessages(data);
  })
}

export default {
  newMessage
}

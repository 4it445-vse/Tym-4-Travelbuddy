import io from 'socket.io-client'


function newMessage(buddy_id){
  var socket = io.connect('http://localhost:3000');
  socket.emit('identify', buddy_id);
  socket.on('newMessage', function (){

    //zde se frontend dozví o nové zprávě určené pro zalogovaného uživatele

    console.log('Hurray')})
}

export default {
  newMessage
}

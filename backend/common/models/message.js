'use strict';

module.exports = function(Message) {

  var app = require('../../server/server');

  Message.observe('after save', function(ctx, next) {
    if(ctx.isNewInstance){
      app.io.to(ctx.instance.buddy_id_to).emit('newMessage', {to: ctx.instance.buddy_id_to, from: ctx.instance.buddy_id_from});
    }
    next();
  });

};

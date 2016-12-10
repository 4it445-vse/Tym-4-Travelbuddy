'use strict';

module.exports = function(Message) {
  Message.on('changed', function(obj) {
    console.log("##### observer registred", obj);
  });
};

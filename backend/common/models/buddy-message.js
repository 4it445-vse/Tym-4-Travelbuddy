'use strict';

module.exports = function(Message) {
  Message.on('update', function () {
    console.log("Update message captured: ", filter, empty, cb);
  })
};

module.exports = function (app) {

  var Message = app.models.Message;
  var Buddy = app.models.Buddy;

  Message.messagesDisplayed = function(where, cb) {
    console.log("where in messagesDisplayed: ", where);
    Message.updateAll(where, {displayed: true}, function(err, info) {
      console.log("Error: ", err);
      console.log("Info: ", info, info.count);
      if (err) return cb(null, "FAIL");

      cb(null, "OK");
    });
  };
  Message.remoteMethod(
    'messagesDisplayed', {
      http: {
        path: '/messages-displayed',
        verb: 'post'
      },
      accepts: {
        arg: 'where',
        type: 'object'
      },
      returns: {
        arg: 'status',
        type: 'string'
      }
    }
  );

  Message.resetPassRequest = function(email, cb) {
    console.log("request for email for password reset");
      console.log("email in resetPassRequest: ", email);
    Buddy.resetPassword({
      email: email
    }, function(err, sss) {
      if (err) return cb(null, "FAIL");

      cb(null, "OK");
    });
  };

  Message.remoteMethod(
      'resetPassRequest', {
        http: {
          path: '/request-pass-reset',
          verb: 'post'
        },
        accepts: {
          arg: 'email',
          type: 'string'
        },
        returns: {
          arg: 'status',
          type: 'string'
        }
      }
  );

  Message.resetPassword = function(body, cb) {
    if (!body.accessToken) return cb(null, "Access token not supplied!");
    let tokenParts = body.accessToken.split('---');
    if ((new Date().getTime() - new Date(tokenParts[1]).getTime()) >0)  return cb(null, "Access token expired!");
    Buddy.update({email: body.email, verificationToken: body.accessToken}, {password: Buddy.hashPassword(body.password), verificationToken:null}, function (err, user) {
      if (err || user.count === 0) return cb(null, "Password update failed!");
      console.log('> password reset processed successfully');
      cb(null, "OK");
    });

  };
  Message.remoteMethod(
      'resetPassword', {
        http: {
          path: '/reset-password',
          verb: 'post'
        },
        accepts: {
          arg: 'body',
          type: 'object'
        },
        returns: {
          arg: 'status',
          type: 'string'
        }
      }
  );

  app.dataSources.mysqlds.autoupdate('Buddy', function (err) {
    if (!Buddy) {
      return;
    }
  });

  app.dataSources.mysqlds.autoupdate('Request', function (err) {
    const {Request} = app.models;
    if (!Request) {
      return;
    }
  });

  app.dataSources.mysqlds.autoupdate('Message', function (err) {
    if (!Message) {
      return;
    }
  });

  app.dataSources.mysqlds.autoupdate('Meetup', function (err) {
    const {Meetup} = app.models;
    if (!Meetup) {
      return;
    }
  });

  app.dataSources.mysqlds.autoupdate('BuddyRating', function (err) {
    const {BuddyRating} = app.models;
    if (!BuddyRating) {
      return;
    }
  });
};

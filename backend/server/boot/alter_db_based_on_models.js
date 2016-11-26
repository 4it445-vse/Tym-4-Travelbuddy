module.exports = function (app) {

  var Message = app.models.Message;
  var Buddy = app.models.Buddy;

  Message.resetPassRequest = function(email, cb) {
    console.log("request for email for password reset");
    Buddy.resetPassword({
      email: email
    }, function(err) {
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
    console.log("here in reset password method");
    if (!body.accessToken) return cb(null, "Access token not supplied!");
    Buddy.update({email: body.email, verificationToken: body.accessToken}, {password: Buddy.hashPassword(body.password), verificationToken:null}, function (err, user) {
      console.log(err);
      if (err) return cb(null, "Password update failed!");
      console.log('> password reset processed successfully');
      cb(null, "OK");
    });
    /*Buddy.findOne({Filter:{where:{email: body.email}}}, function (err, user) {
      console.log(user);
      if (err)  return cb(null, "User with "+body.email+" not found!");
      user.updateAttribute('password', Buddy.hashPassword(body.password), function (err, user) {
        console.log(err);
        if (err) return cb(null, "Password update failed!");
        console.log('> password reset processed successfully');
        cb(null, "OK");
      });
    });*/

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
};

'use strict';

const {
  API_HOST,
  API_PORT,
  API_PROTOCOL,
  VERIFY_EMAIL_REDIRECT
} = process.env;

module.exports = function (Buddy) {

  /*
   * send verification email after registration
   */
  Buddy.afterRemote('create', function(context, currentBuddy, next) {
    console.log('> Usermain.afterRemote triggered');

    var options = {
      type: 'email',
      to: currentBuddy.email,
      from: 'noreply@travelbuddy.com',
      subject: 'Travel Buddy | Verify email',
      template: 'server/views/verify.ejs',
      redirect: VERIFY_EMAIL_REDIRECT,
      user: currentBuddy,
      host: API_HOST,
      port: API_PORT,
      protocol: API_PROTOCOL
    };

    console.log('---- options', options);

    currentBuddy.verify(options, function(err, response) {
      if (err) {
        Buddy.deleteById(currentBuddy.id);
        return next(err);
      } else {
        next();
      }

      console.log('> verification email sent:', response);

    });
  });

};

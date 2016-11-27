'use strict';

const {
    API_HOST,
    API_PORT,
    API_PROTOCOL,
    API_PORT_FRONTEND,
    API_HOST_FRONTEND
} = process.env;

module.exports = function (Buddy) {

    var excludedProperties = [
        'realm',
        'username'
    ];
    excludedProperties.forEach(function (p) {
        delete Buddy.definition.rawProperties[p];
        delete Buddy.definition.properties[p];
        delete Buddy.prototype[p];
    });

    /*
     * send verification email after registration
     */
    Buddy.afterRemote('create', function (context, currentBuddy, next) {
        console.log('> Usermain.afterRemote triggered');

        var options = {
            type: 'email',
            to: currentBuddy.email,
            from: 'noreply@travelbuddy.com',
            subject: 'Travel Buddy | Verify email',
            template: 'server/views/verify.ejs',
            redirect: API_PROTOCOL + '://' + API_HOST_FRONTEND + ':' + API_PORT_FRONTEND + '/verified',
            user: currentBuddy,
            host: API_HOST,
            port: API_PORT,
            protocol: API_PROTOCOL
        };

        console.log('---- options', options);

        currentBuddy.verify(options, function (err, response) {
            if (err) {
                Buddy.deleteById(currentBuddy.id);
                return next(err);
            } else {
                next();
            }

            console.log('> verification email sent:', response);

        });
    });

    Buddy.on('resetPasswordRequest', function (info) {
        console.log("in resetPasswordRequest");
        console.log("info email: ", info);
        Buddy.findById(info.user.id, function (err, user) {
            console.log(user);
            Buddy.generateVerificationToken(user, function(err, token){
                console.log(user);
                console.log(token);
                Buddy.update({id: user.id}, {verificationToken:token}, function (err, user) {
                    console.log(err);
                    if (err) return cb(null, "Token update failed!");
                    console.log('> password reset processed successfully');
                    var url = API_PROTOCOL + '://' + API_HOST_FRONTEND + ':' + API_PORT_FRONTEND + '/reset-password';
                    var html = 'Klikni <a href="' + url + '?access_token=' +
                        token + '&email='+info.email+'">zde</a> pro obnovu hesla';
                    console.log("about to send email");
                    Buddy.app.models.Email.send({
                        to: info.email,
                        from: info.email,
                        subject: 'Obnova hesla',
                        html: html
                    }, function (err) {
                        if (err) return console.log('> error sending password reset email');
                        console.log('> sending password reset email to:', info.email);
                    });
                });

            });

        });

    });
};

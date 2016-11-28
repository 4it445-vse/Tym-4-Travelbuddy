'use strict';

const log4js = require('log4js');
log4js.configure({
    appenders: [
        {type: 'console'},
        {
            type: 'file',
            filename: `log/app.log`,
        },
    ],
    replaceConsole: true,
});

var dotenv = require('dotenv');
dotenv.config();

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
var multer = require('multer');
app.use(multer().none());

app.get('/hello', function (req, res) {
    const data = {
        hello: 'world',
        time: new Date(),
    };
    res.header({'Content-Type': 'application/json'});
    res.send(JSON.stringify(data));
});

var fs = require('fs');
app.get('/get-avatar', function (req, res) {
  var userId = req.query.userId;
  var avatarUrl;

  fs.access('../frontend/public/avatars/' + userId + '.jpg', (err) => {
    if (!err) {
      avatarUrl = "http://localhost:3000/avatars/" + userId + ".jpg";
    } else {
        avatarUrl = "http://images.megaupload.cz/mystery-man.png";
    }

    const data = {
      userId: userId,
      avatarUrl: avatarUrl
    };

    res.header({'Content-Type': 'application/json'});
    res.send(JSON.stringify(data));
  });
});

var express = require('express');
var expressApp = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    console.log('request', file);
    cb(null, "_" + file.originalname);
  }
});
var upload = multer({ storage: storage });

expressApp.post('/upload-avatar',  upload.single('avatarUpload'), function (req, res) {
  var userId = req.body.userId;
  fs.rename('uploads/' + "_" + req.file.originalname, '../frontend/public/avatars/' + userId + '.jpg', function(err) {
    if ( err ) console.log('ERROR: ' + err);
  });
  console.log('Upload avatar picture for user with id ' + userId + ' done');
  res.status(204).end()
});

expressApp.listen(3003, function () {
  console.log('Express app listening on port 3003!')
});



app.start = function () {
    // start the web server
    return app.listen(function () {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module || GLOBAL.PhusionPassenger)
        app.start();
});

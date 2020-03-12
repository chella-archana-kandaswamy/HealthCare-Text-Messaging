var express = require('express');
var path = require('path');
var fs = require('fs');
var routes = require('./routes/index');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/models',express.static('models'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', routes);





mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/twilioSms');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("Sucessfully connected to Db");
    
});



app.listen(3000, function() {
  console.log('app started');
  console.log('listening on port 3000');
});




/*
 * Main App file App.js
 * @author Mathias STEVENS
 */

// Dependencies requirements, Express 4
var express        	= require('express');
var morgan         	= require('morgan');
//var multer  		= require('multer');
var bodyParser 		   = require('body-parser');
var methodOverride 	= require('method-override');
var mongoose        = require("mongoose");
var app            	= express();
var fs              = require('fs');


app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//app.use(multer({ dest: './uploads/'}));
app.use(methodOverride());

app.listen(8090);
console.log('Im listening on port 8090');


// MongoDB configuration
mongoose.connect('mongodb://localhost/aristide', function(err, res) {
  if(err) {
    console.log('error connecting to MongoDB Database. ' + err);
  } else {
    console.log('Connected to Database');
  }
});

//Deal with CORS issues
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

// First example router
app.get('/', function(req, res) {
  res.send("Hello world!");
});

//Add the routes
var routes = require('./routes/customer')(app);
/*
 * Main App file App.js
 * @author Mathias STEVENS
 */

// Dependencies requirements, Express 4
var express        	= require('express');
var morgan         	= require('morgan');
var bodyParser      = require('body-parser');
var multer          = require('multer');
var methodOverride 	= require('method-override');
var mongoose        = require("mongoose");
var app            	= express();
var fs              = require('fs');

app.use('/static', express.static(__dirname + '/uploads'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: './uploads/'}));
app.use(methodOverride());


app.configure('prod', function(){
  app.listen(8080);
  // MongoDB configuration
  mongoose.connect('mongodb://10.240.237.154/aristide', function(err, res) {
    if(err) {
      console.log('error connecting to MongoDB Database. ' + err);
    } else {
      console.log('Connected to Database');
    }
  });
});
app.configure('dev', function(){
  app.listen(8090);
  // MongoDB configuration
  mongoose.connect('mongodb://localhost/aristide', function(err, res) {
    if(err) {
      console.log('error connecting to MongoDB Database. ' + err);
    } else {
      console.log('Connected to Database');
    }
  });
});

console.log('Im listening on port 8080');

//Deal with CORS issues
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

// First example router
app.get('/', function(req, res) {
  res.send("Hello Aristide Backend!");
});

app.post('/upload', function (req, res) {
    setTimeout(
        function () {
          console.log(req.files);
            res.setHeader('Content-Type', 'text/html');
            if (req.files.length == 0 || req.files.file.size == 0) {              
              res.send({ msg: 'No file uploaded at ' + new Date().toString() });
            } else {
                var tmp_path = req.files.file.path;
                // Set where the file should actually exists - in this case it is in the "images" directory.
                fileName = req.files.file.originalname;
                filePath = './uploads/' + fileName;      
                // Move the file from the temporary location to the intended location
                fs.rename(tmp_path, filePath, function(err) {
                    if (err)
                        throw err;
                    else                      
                       //res.send({ msg: '<b>"' + illustrationPath + '"</b> uploaded to the server at ' + new Date().toString() });
                       res.send("<script>document.domain='localhost'</script><status>ok</status><file>"+fileName+"</file><index>"+req.body.index+"</index>");
                    // Delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files.
                    fs.unlink(tmp_path, function() {
                        if (err)
                            throw err;
                        //
                    });
                });
            }
        },
        (req.param('delay', 'yes') == 'yes') ? 2000 : -1
    );
});

//Add the routes
var routesCustomer = require('/.routes/customer')(app);
var routesBooking = require('./routes/booking')(app);
var routesPassType = require('./routes/passType')(app);
var routesStayType = require('./routes/stayType')(app);
var routesRoom = require('./routes/room')(app);

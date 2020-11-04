var express = require('express');
var storage = require('node-persist');
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

const port = 3000
const app = express(); 

mongoose.connect('mongodb://localhost/BackendProjectDB', { useNewUrlParser: true, useUnifiedTopology: true },);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error:'));
db.once('open', () => {
});

app.use(session({
  secret: 'this is secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));


// Holds the current views
var counter = 0;
// Registers an event triggered on HTTP GET /visit
app.get("/visit", (req, res) => {
  counter++;
  // Saves counter into the store and send response AFTER the store has been saved
  storage.setItem("counter", counter).then(() => {
      res.json(counter);
  });
});
// Inits permanent storage and reads the saved counter
storage.init().then(() => storage.getItem("counter")).then((value) => {
  // Checks if value read is valid, otherwise set it to 0
  if (value > 0) {
      counter = value;
  } else {
      counter = 0;
  }
}) 


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`)
}) 

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs')
var logger = require('./logger')
var notFoundLogger = require('./notFoundLogger')
var errorLogger = require('./errorLogger')

var fs = require('fs');

var mongoConfig = require('./mongodb/Connections')
var userLogin = require('./routes/userLogin')
var updateProfile = require('./routes/updateProfile')
var createOrUpdateEvents = require('./routes/createOrUpdateEvents')
var createOrUpdateGroups = require('./routes/createOrUpdateGroups')
var groupfeed = require ('./routes/groupfeed')
var emp = require('./routes/emp')



var app = express();

var logDirectory = path.join(__dirname, 'log')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)

const cors = require('cors')
app.use(cors())

const fileUpload = require('express-fileupload')
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/updateProfile', updateProfile)
app.use('/createOrUpdateEvents',createOrUpdateEvents)
app.use('/createOrUpdateGroups',createOrUpdateGroups)
app.use('/groupfeed',groupfeed)
app.use('/userLogin/',userLogin)
app.use('/emp',emp)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found - ' + req.method + ' - ' + req.originalUrl)
  console.log(req.originalUrl)
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  notFoundLogger.error(err.stack);

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

process.on('uncaughtException', function (err) {
  errorLogger.error(err.stack);
});

module.exports = app
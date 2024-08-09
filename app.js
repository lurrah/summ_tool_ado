const createError = require('http-errors');
const express = require('express');
const session = require('express-session')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const env = require('dotenv').config();

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const azure_authRouter = require('./routes/azure_auth');
const {connectDB} = require('./backend/db_connections.js');

//var middleware = require('./middleware');

const app = express();

const session_secret = process.env.SESSION;

app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   secure: 'production',
  //   httpOnly: true,
  //   sameSite: 'lax'
  // }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/azure_auth', azure_authRouter);

connectDB();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

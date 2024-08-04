// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// const mongoose = require('mongoose');

// var app = express();

// mongoose.connect('mongodb://127.0.0.1:27017/inventory')
// .then(() => {
//   console.log('MongoDB connection established successfully');
// })
// .catch(err => {
//   console.error('MongoDB connection error:', err);
// });

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// //import routes
// const categoriesRouter = require('./routes/categories');

// // Use routes
// app.use('/', categoriesRouter);

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


// module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/inventory')
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // For serving static files (like images)

// Set up EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(ejsLayouts);
// app.set('layout', 'layout');

// Import and use routes
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
app.use('/', categoriesRouter);
app.use('/products', productsRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


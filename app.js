var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var swaggerjsdoc = require('swagger-jsdoc');
var swaggerui = require('swagger-ui-express')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const cors = require('cors');

var app = express();

const { FirebaseController } = require('./controllers/FirebaseController');

app.use(cors({
  origin: '*'
}));

// const allowedOrigins = ['http://yourfrontenddomain.com', 'http://localhost:3000'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.use(cors(corsOptions));

// Middleware to set the Access-Control-Allow-Origin header
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', 'https://binar-team2ch9-frontend.netlify.app');
  next();
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// SWAGGER
const swaggerConfig = swaggerjsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Article Service API Documentation',
      description: 'Dokumentasi ini berkenaan dengan API - API untuk servis article',
      version: '0.5.0',
      contact: {
        email: 'valdryan08@gmail.com',
        name: 'Valdryan Ivandito',
        url: 'valdryan08@github.io'
      }
    },
    server: [
      {
        url: 'http://localhost:3005',
        description: 'Local Server'
      },
      {
        url: 'https://article-service.evennode.com',
        description: 'Development Server'
      }
    ]
  },
  apis: ['./routes/*.js']
});

app.use('/docs', swaggerui.serve, swaggerui.setup(swaggerConfig));

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

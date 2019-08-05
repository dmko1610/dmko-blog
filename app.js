const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const okta = require("@okta/okta-sdk-nodejs");
const session = require("express-session");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
const auth = require("./auth");
const blogRouter = require('./routes/blog');
const usersRouter = require('./routes/users');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const oidc = new ExpressOIDC({
  issuer: "https://dev-366955.okta.com/oauth2/default",
  client_id: "0oa11bo5mceLSqQ64357",
  client_secret: "nmmlxquGB99plV7suOoHLbWVG1Ng_SyoeXuDSTqZ",
  redirect_uri: "http://localhost:3000/users/callback",
  // redirect_uri: "https://dmko-blog.herokuapp.com/users/callback",
  appBaseUrl: "http://localhost:3000",
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    // @ts-ignore
    callback: {
      path: "/users/callback",
      defaultRedirect: "/dashboard"
    }
  }
});

app.use(session({
  secret: "sdfsdjafjkjJJFkkfdjkfsdgjhghueJJfiu",
  resave: true,
  saveUninitialized: false
}));

app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) return next();

  auth.client.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    });
});

// Routes
app.use('/', blogRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

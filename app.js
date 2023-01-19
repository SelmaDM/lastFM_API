var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

var logger = require('morgan');

var indexRouter = require('./routes/index');
var artistsRouter = require('./routes/artists');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/artists', artistsRouter);

module.exports = app;
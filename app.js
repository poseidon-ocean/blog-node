//导入相关模块
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var connect = require('connect');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');


var settings = require('./conf/settings');
var RedisStore = require('connect-redis')(session);
var flash = require('connect-flash');

var app = express();




//app.set('port',process.env.PORT || 3000);  //监听端口

// view engine setup
//以下两行代码设置模板的文件路径和模板引擎
app.set('views', path.join(__dirname, 'views'));  //设置视图文件目录
app.set('view engine', 'jade');  //设置模板引擎
//app.set('view engine', 'ejs');

app.use(flash());

//connect的内建中间件
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(logger('dev'));  //显示简单日志
app.use(bodyParser.json());  //请求解析体
app.use(bodyParser.urlencoded({ extended: false }));


//app.use(cookieParser());
//会话支持
app.use(cookieParser());
app.use(session({
  secret : settings.cookiesSecret,
  key : settings.db,
  cookies : {maxAge:1000*60*60*24*30},  //设置生存期为30天
  store : new RedisStore({
    host : '127.0.0.1',
    port : 6379,
    ttl : 1800//过期时间
  })
}));

app.use(express.static(path.join(__dirname, 'public')));

//user信息存放
app.use(function(req, res, next){
  console.log("app.usr local");
  res.locals.username = req.session.username;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;

  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
});

//app.use(app.router());b //调用路由解析的规则
app.use('/', routes);
app.use('/users', users);

app.get('/hello',function(req,res){
    res.send("Hello World");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler  开发环境错误处理
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

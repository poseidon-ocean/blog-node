var express = require('express');
var router = express.Router();

var crypto = require('crypto'); //生成散列值  加密密码
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: '主页',
    user : req.session.user,
    success : req.flash('success').toString(),
    error : req.flash('error').toString()
  });
  //res.render('index', { title: '主页' });
});

router.get('/reg', function(req, res, next) {
  res.render('index', {
    title: '注册',
    user : req.session.user,
    success : req.flash('success').toString(),
    error : req.flash('error').toString()
  });
  //res.render('reg', { title: '注册' });
});
router.post('/reg', function(req, res, next) {
  var username = req.body.username,
      password = req.body.password,
      password_re = req.body['password-repeat'];

  //检验用户两次输入的密码是否一致
  if(password_re != password){
    req.flash('error','两次输入的密码不一致');
    return res.redirect('/reg');
  }

  //生成密码的md5值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
    username : req.body.username,
    password : password,
    email : req.body.email
  });

  //如果不存在则新增用户
  newUser.save(function(err,user){
    //检查用户名是否已经存在
    if(err == '1'){
      req.flash('error','用户已经存在');
      return res.redirect('/reg');  //返回注册页
    }

    if(err){
      req.flash('error',err);
      return res.redirect('/reg');  //注册失败返回注册页
    }
    req.session.user = user;//用户信息存入session中
    req.flash('success','注册成功');
    res.redirect('/');//返回主页
  });

});

router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录' });
});
router.post('/login', function(req, res, next) {
  //生成密码的md5值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');

  //检查用户是否存在
  User.get(req.body.username,function(err,user){
    if(!user.length){
      req.flash('error','用户不存在');
      return res.redirect('/login');  //用户不存在  继续登录
    }

    //检查密码是否一致
    if(user[0].password != password){
      req.flash('error','密码不正确');
      return res.redirect('/login');  //用户不存在  继续登录
    }
    //用户  密码匹配后存放到session中
    req.session.user = user;
    req.flash('success','登录成功');
    res.redirect('/');  //跳往主页

  });

});

router.get('/post', function(req, res, next) {
  res.render('post', { title: '发表' });
});
router.post('/post', function(req, res, next) {
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.flash('success','退出成功');
  res.redirect('/');
});

module.exports = router;


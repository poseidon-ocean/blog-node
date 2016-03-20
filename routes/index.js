var express = require('express');
var router = express.Router();

var crypto = require('crypto'); //生成散列值  加密密码
var User = require('../models/user');
var Post = require('../models/post');

/*===============================访问主页=======================================================*/
/* GET home page. */
router.get('/', function(req, res, next) {
  Post.get(null,function(err,posts){
    if(err) {
      posts = [];
    }
    res.render('index', {
      title: '主页',
      user : req.session.username,
      posts : posts,
      success : req.flash('success').toString(),
      error : req.flash('error').toString()
    });
  });
  //res.render('index', { title: '主页' });
});



/*===============================注册=======================================================*/
router.get('/reg',checkNotLogin);
router.get('/reg', function(req, res, next) {
  res.render('reg', {
    title: '注册',
    user : req.session.username,
    success : req.flash('success').toString(),
    error : req.flash('error').toString()
  });
  //res.render('reg', { title: '注册' });
});

router.post('/reg',checkNotLogin);
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
    req.session.username = username;//用户信息存入session中
    req.flash('success','注册成功');
    res.redirect('/');//返回主页
  });

});


/*===============================登录=======================================================*/
router.get('/login',checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录' });
});

router.post('/login',checkNotLogin);
router.post('/login', function(req, res, next) {
  //生成密码的md5值
  var md5 = crypto.createHash('md5'),
      username = req.body.username,
      password = md5.update(req.body.password).digest('hex');

  //检查用户是否存在
  User.get(username,function(err,user){
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
    console.log("================="+user.username);
    req.session.username = username;
    req.flash('success','登录成功');
    res.redirect('/');  //跳往主页

  });

});

/*===============================发表=======================================================*/
router.get('/post',checkLogin);
router.get('/post', function(req, res, next) {
  res.render('post', {
    title : '发表',
    user : req.session.username,
    success : req.flash('success').toString(),
    error : req.flash('error').toString()
  });
});

router.post('/post',checkLogin);
router.post('/post', function(req, res) {
  var post = new Post({
    author : req.session.username,
    title : req.body.title,
    post : req.body.post
  });

  post.save(function(err){
    if(err){
      req.flash("error",err);
      return res.redirect("/");
    }

    req.flash("success","发布成功！");
    res.redirect("/");
  });
});

/*===============================退出=======================================================*/
router.get('/logout',checkLogin);
router.get('/logout', function(req, res, next) {
  req.session.username = null;
  req.flash('success','退出成功');
  res.redirect('/');
});

module.exports = router;


//注册和登录的页面阻止已登录用户访问
function checkLogin(req,res,next){
  if(!req.session.username){
    req.flash('error','未登录');
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.username){
    req.flash('error','已登录');
    res.redirect('back');  //返回之前的页面
  }
  next();
}

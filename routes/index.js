var express = require('express');
var router = express.Router();

var passport = require('passport');


var User = require('../models/user');


var Product = require('../models/product');

/**
function checkLogin(req, res, next){
	if(req.isAuthenticated()){
		next();
	} else {
		req.flash('info', '请登录');
		res.redirect('/login');
	}
}

 */

// 保存模板使用的变量,通过这些变量传入模板。
router.use(function(req, res, next) {
  res.locals.user = req.user;
  //res.locals.products = req.products;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});


// 展示首屏。
router.get('/', function(req, res, next) {
  Product
    .find({
      $or: [
        { name: 'head1' },
        { name: 'body1' },
        { name: 'foot1' }
      ]
    })
    .exec(function(err, products) {
      if (err) {
        return next(err);
      }
      res.render('index', { products: products });
    });
  //res.render('index', { product: 'maybeeee'});
});

// 获取产品信息路由。
// 通过客户端Ajax查询数据库中的产品信息。
// 再将查询到的数据以JSON对象的形式返回。
// req.query.part是Ajax中的查询字符串字段。
router.get('/product', function(req, res, next) {
  Product.findOne({ name: req.query.part }).exec(function(err, product) {
    if (err) {
      return next(err);
    }
    res.json(product);
  });
});


// 登录页
router.get('/login', function(req, res) {
  res.render('login');
});

// 提交登录信息
router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// 联系页
router.get('/contact', function(req, res) {
  res.render('contact');
});

// 获取注册
router.get('/signup', function(req, res) {
  res.render('signup');
});

// 提交注册信息。
// 处理注册信息路由，并将账户信息保存到数据库。
router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      req.flash('error', '用户已存在');
      return res.redirect('/login');
    }
    var newUser = new User({
      username: username,
      password: password
    });
    newUser.save(next);
  });
}, passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

// 登出
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
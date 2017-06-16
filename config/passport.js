var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(){
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy(function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: '用户名错误' });
        }

        // 密码校验方法
        user.checkPassword(password, function(err, isMatch){
          if(err){
            return done(err);
          }
          if(isMatch){
            return done(null, user);
          } else {
            return done(null, false, {message: '密码不正确'});
          }
        });
      });
  }));
};
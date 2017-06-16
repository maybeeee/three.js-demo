var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var saltRound = 10;
var noop = function(){};
var userSchema = new mongoose.Schema({
	username:{type:String, required:true, unique:true},
	password:{type:String, required:true}
});

userSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')){
		return next();
	};

	bcrypt.genSalt(saltRound, function(err, salt){
		if(err) return next(err);
		bcrypt.hash(user.password, salt, noop,function(err, hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.checkPassword = function(guess, next){
	bcrypt.compare(guess,this.password, function(err, isMatch){
		next(err, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);

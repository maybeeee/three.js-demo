// 初始化产品信息。
var mongoose = require('mongoose');
var Product = require('../models/product');
mongoose.connect('mongodb://localhost:27017/data/maybeeee');

var part = ['head', 'body', 'foot'];

var products = [];

for(var i=0; i<part.length;i++){
    for(var j=1; j<5; j++){
        products.push(new Product({
            name: part[i] + j,
            objPath: 'models/' + part[i] + '/' + j + '.obj',
            mtlPath: 'models/' + part[i] + '/' + j + '.mtl'
        }));
    }
}

var done = 0;

for(var k=0;k<products.length;k++){
    products[k].save(function(err, result){
        if(err){
            return console.log(err);
        }
        done++;
        if(done === products.length){
            console.log('数据库写入完毕');
            mongoose.disconnect();
        }
    })
}


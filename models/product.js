var mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    objPath: {type: String, required: true, unique: true},
    mtlPath: {type: String, required: true, unique: true}
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;
var mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
    {
        category:String,
        subCategory:String,
        image:String,
        brand:String,
        price:Number,
        description:String,
        discount:Number,
        quantity:Number
    }
);

var Product = mongoose.model("product",productSchema);

module.exports = Product;
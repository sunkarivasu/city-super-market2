var mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
    {
        productId:String,
        category:String,
        subCategory:String,
        image:String,
        brand:String,
        price:Number,
        description:String,
        discount:Number,
        quantityType:String,
        quantity:Number
    }
);

var Product = mongoose.model("product",productSchema);

module.exports = Product;
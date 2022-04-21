var mongoose = require("mongoose");
// var {productSchema} = require("./product.model");

var userSchema = new mongoose.Schema(
    {
        name:String,
        password:String,
        emailId:String,
        phoneNumber:Number,
        address:{
            doorNumber:String,
            streetName:String,
            landMark:String,
            village:String,
            pincode:Number
        },
        cartItems:[
            {productId:mongoose.ObjectId,orderQuantity:Number}
        ],
        isAdmin:Boolean
    }
);

var User = mongoose.model("user",userSchema);

module.exports = User;
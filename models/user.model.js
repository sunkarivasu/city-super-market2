var mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
    {
        name:String,
        password:String,
        emailId:String,
        phoneNumber:Number,
        address:mongoose.Schema.ObjectId,
        cartItems:[ {productId: mongoose.Schema.ObjectId, orderQuantity:Number}],
        isAdmin:Boolean
    }
);

var User = mongoose.model("user",userSchema);

module.exports = User;
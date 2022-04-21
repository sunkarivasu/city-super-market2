var mongoose = require("mongoose");
var orderSchema = new mongoose.Schema(
    {
        userId:mongoose.Schema.ObjectId,
        productId:mongoose.Schema.ObjectId,
        paymentId:String,
        quantity:Number,
        amount:Number,
        status:String,
        deliveryAddress:{
            firstName:String,
            lastName:String,
            mobile:Number,
            mandel:String,
            village:String,
            doorNumber:String,
            streetName:String,
            // landMark:String,
            pinCode:Number
        }
    }
);

var Order = mongoose.model("order",orderSchema);

module.exports = Order;
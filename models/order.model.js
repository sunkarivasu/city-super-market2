var mongoose = require("mongoose");
var orderSchema = new mongoose.Schema(
    {
        orderId:Number,
        userId:mongoose.Schema.ObjectId,
        amount:Number,
        status:String,
        orderItems:[mongoose.Schema.ObjectId],
    }
);

var Order = mongoose.model("order",orderSchema);

module.exports = Order;
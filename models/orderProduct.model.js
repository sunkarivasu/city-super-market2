var mongoose = require("mongoose");

var orderProductSchema = new mongoose.Schema(
    {
        productId:mongoose.Schema.ObjectId,
        quantity:Number,
        orderQuantity:Number,
    }
);

var OrderProduct = new mongoose.model("orderProduct",orderProductSchema);
module.exports = OrderProduct;
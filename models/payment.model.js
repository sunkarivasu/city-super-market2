var mongoose = require("mongoose");

var paymentSchema = new mongoose.Schema(
    {
        date:String,
        cost:Number,
        status:String
    }
);

var Payment = mongoose.model("user",paymentSchema);

module.exports = Payment;
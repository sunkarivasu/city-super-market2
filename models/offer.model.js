var mongoose = require("mongoose");

var offerSchema = new mongoose.Schema(
    {
        productName:String,
        description:String,
        image:String,
        worth:Number,
        date:Date,
    }
);

var Offer = mongoose.model("offer",offerSchema);

module.exports = Offer;
var mongoose = require("mongoose");

var normalOfferSchema = new mongoose.Schema(
    {
        productName:String,
        description:String,
        image:String,
        price:Number,
        discount:Number,
        status:{
            type:String,
            default:"Active"
        }
    }
);

var normalOffer = mongoose.model("normalOffer",normalOfferSchema);

module.exports = normalOffer;
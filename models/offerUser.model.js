var mongoose = require("mongoose");

var offerUserSchema = new mongoose.Schema(
    {
        name:String,
        phoneNumber:Number,
        startDate:Date,
        endDate:Date,
        alreadyWinner:{
            default:false,
            type:Boolean
        }
    }
);

var OfferUser = mongoose.model("offerUser",offerUserSchema);

module.exports = OfferUser;
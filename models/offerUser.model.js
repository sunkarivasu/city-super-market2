var mongoose = require("mongoose");

var offerUserSchema = new mongoose.Schema(
    {
        name:String,
        phoneNumber:Number,
        startDate:Date,
        endDate:Date
    }
);

var OfferUser = mongoose.model("offerUser",offerUserSchema);

module.exports = OfferUser;
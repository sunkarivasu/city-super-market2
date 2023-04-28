var mongoose = require("mongoose");

var addressSchema = new mongoose.Schema(
    {
        doorNumber:String,
        streetName:String,
        landMark:String,
        village:String,
        pincode:Number,
        mandel:String,
    }
)

var Address = mongoose.model("address",addressSchema);

module.exports = Address;
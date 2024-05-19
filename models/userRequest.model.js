var mongoose = require("mongoose");

var userRequestSchema = new mongoose.Schema(
    {
        name:String,
        phoneNumber:Number,
        noOfDays:Number,
        status:{
            default:"",
            type:String
        }
    }
);

var UserRequest = mongoose.model("userRequest",userRequestSchema);

module.exports = UserRequest;
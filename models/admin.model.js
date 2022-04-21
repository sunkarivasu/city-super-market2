var mongoose = require("mongoose");

var adminSchema = new mongoose.Schema(
    {
        adminId:String,
        password:String
    }
);

var Admin = mongoose.model("user",adminSchema);

module.exports = Admin;
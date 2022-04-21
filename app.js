require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
PORT = process.env.PORT || 9000;
var app = express();
var cors =require("cors");
var path = require("path");
var fs = require("fs");
require("./config/passport");


// mongoose.connect("mongodb://localhost:27017/CitySuperMarketDB",function(err)
// {
//     if(err)
//         console.log("error"+err);
//     else
//         console.log("connected");
// });
mongoose.connect(process.env.URI,{useNewUrlParser:true},(err) =>{
    if(err)
        console.log("Error while connecting to database:"+err);
    else
        console.log("conneted to database")
});

var usersRouter = require("./routes/users");
var categoriesRouter = require("./routes/categories");
var productRouter = require("./routes/products");
var orderRouter = require("./routes/orders");
//var adminRouter = require("./routes/admin");
var multer = require("multer");
const { param } = require("./routes/users");

app.use(cors());
app.use(express.json())
app.use("/users",usersRouter);
app.use("/categories",categoriesRouter);
app.use("/products",productRouter);
app.use("/orders",orderRouter);
//app.use("/admin",adminRouter)
app.use(passport.initialize());

if (process.env.NODE_ENV === 'production') {
    // Set Static Folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
};


app.get("/checkAdminToken",passport.authenticate("jwt",{session:false}),(req,res)=>
{
    return res.send(
        {
            success:true,
        })
});

app.get("/checkUserToken",passport.authenticate("jwt",{session:false}),(req,res)=>
{
    return  res.send(
            {
                success:true
            })
})


app.listen(PORT,console.log(`server is up and runnning on port ${PORT}`));

// module.exports=upload;
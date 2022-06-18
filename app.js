require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var https = require("https");
PORT = process.env.PORT || 9000;
var app = express();
var cors =require("cors");
var path = require("path");
var fs = require("fs");
require("./config/passport");

var checksum_lib = require("./Paytm/checksum");
var config = require("./Paytm/config");

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

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
var paymentRouter = require("./routes/payments");
//var adminRouter = require("./routes/admin");
var multer = require("multer");
const { param } = require("./routes/users");

app.use(cors());
app.use(express.json())
app.use("/users",usersRouter);
app.use("/categories",categoriesRouter);
app.use("/products",productRouter);
app.use("/orders",orderRouter);
app.use("/payments",paymentRouter);
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

//paytm integration

app.post("/paynow", [parseUrl, parseJson], (req, res) => {
    // Route for making payment
  
    var paymentDetails = {
      amount: req.body.amount,
      customerId: req.body.firstName+" "+req.body.lastName,
      customerEmail: req.body.email,
      customerPhone: req.body.mobile
  }
  if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
      res.status(400).send('Payment failed')
  } else {
      var params = {};
      params['MID'] = config.PaytmConfig.mid;
      params['WEBSITE'] = config.PaytmConfig.website;
      params['CHANNEL_ID'] = 'WEB';
      params['INDUSTRY_TYPE_ID'] = 'Retail';
      params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
      params['CUST_ID'] = paymentDetails.customerId;
      params['TXN_AMOUNT'] = paymentDetails.amount;
      params['CALLBACK_URL'] = 'http://localhost:3000/callback';
      params['EMAIL'] = paymentDetails.customerEmail;
      params['MOBILE_NO'] = paymentDetails.customerPhone;

  
  
      checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
          var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
          // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

          res.send({"parameters":params,"txn_url":txn_url,"checksum":checksum})
  
         
      });
  }
  });
  // app.post("/callback", (req, res) => {
  //   // Route for verifiying payment
  
  //   var body = '';
  
  //   req.on('data', function (data) {
  //      body += data;
  //   });
  
  //    req.on('end', function () {
  //      var html = "";
  //      var post_data = qs.parse(body);
  
  //      // received params in callback
  //      console.log('Callback Response: ', post_data, "\n");
  
  
  //      // verify the checksum
  //      var checksumhash = post_data.CHECKSUMHASH;
  //      // delete post_data.CHECKSUMHASH;
  //      var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
  //      console.log("Checksum Result => ", result, "\n");
  
  
  //      // Send Server-to-Server request to verify Order Status
  //      var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
  
  //      checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
  
  //        params.CHECKSUMHASH = checksum;
  //        post_data = 'JsonData='+JSON.stringify(params);
  
  //        var options = {
  //          hostname: 'securegw-stage.paytm.in', // for staging
  //          // hostname: 'securegw.paytm.in', // for production
  //          port: 443,
  //          path: '/merchant-status/getTxnStatus',
  //          method: 'POST',
  //          headers: {
  //            'Content-Type': 'application/x-www-form-urlencoded',
  //            'Content-Length': post_data.length
  //          }
  //        };
  
  
  //        // Set up the request
  //        var response = "";
  //        var post_req = https.request(options, function(post_res) {
  //          post_res.on('data', function (chunk) {
  //            response += chunk;
  //          });
  
  //          post_res.on('end', function(){
  //            console.log('S2S Response: ', response, "\n");
  
  //            var _result = JSON.parse(response);
  //              if(_result.STATUS == 'TXN_SUCCESS') {
  //                  res.send('payment sucess')
  //              }else {
  //                  res.send('payment failed')
  //              }
  //            });
  //        });
  
  //        // post the data
  //        post_req.write(post_data);
  //        post_req.end();
  //       });
  //      });
  // });


app.listen(PORT,console.log(`server is up and runnning on port ${PORT}`));

// module.exports=upload;
const router = require("express").Router();
const PaytmChecksum = require("../PaytmChecksum");
const formidable = require("formidable");
var https = require("https");

router.route("/paynow").post((req,res) =>
{

    /* import checksum generation utility */
    // var PaytmChecksum = require("../PaytmChecksum");

    /* initialize JSON String */ 
    // body = "{/*YOUR_COMPLETE_REQUEST_BODY_HERE*/}"
    console.log(process.env.MID);
    var params = {};
      params['MID'] = process.env.MID;
      params['WEBSITE'] = process.env.WEBSITE;
      params['CHANNEL_ID'] = 'WEB';
      params['INDUSTRY_TYPE_ID'] = 'Retail';
      params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
      params['CUST_ID'] = "sunkari_vasu";
      params['TXN_AMOUNT'] = "1";
      params['CALLBACK_URL'] = 'http://localhost:3000/payments/callback';
      params['EMAIL'] = "sunkarivasu1@gmail.com";
      params['MOBILE_NO'] = "9949566585";

    /**
    * Generate checksum by parameters we have
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    var paytmChecksum = PaytmChecksum.generateSignature(params, process.env.KEY);
    paytmChecksum.then(function(result){
        var paytmParams = {
            ...params,
            "CHECKSUMHASH":result
        }
        console.log("generateSignature Returns: " + result);
        res.json(paytmParams);
    }).catch(function(error){
        console.log(error);
    });
    
})


router.route("/callback").post((req,res)=>
{
    var form = new formidable.IncomingForm();

    form.parse(req,(err,fields,files) =>
    {
        // res.json(fields);
        
        var paytmChecksum = fields.CHECKSUMHASH;
        delete fields.CHECKSUMHASH;

        var isVerifySignature = PaytmChecksum.verifySignature(fields, process.env.KEY, paytmChecksum);
        if (isVerifySignature) {

            var paytmParams = {};
            paytmParams["MID"]     = fields.MID;
            paytmParams["ORDERID"] = fields.ORDERID;
            
            /*
            * Generate checksum by parameters we have
            * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
            */
            PaytmChecksum.generateSignature(paytmParams, process.env.KEY).then(function(checksum){
            
                paytmParams["CHECKSUMHASH"] = checksum;
            
                var post_data = JSON.stringify(paytmParams);
            
                var options = {
            
                    /* for Staging */
                    hostname: 'securegw-stage.paytm.in',
            
                    /* for Production */
                    // hostname: 'securegw.paytm.in',
            
                    port: 443,
                    path: '/order/status',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };
            
                var response = "";
                var post_req = https.request(options, function(post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });
            
                    post_res.on('end', function(){
                                let result=JSON.parse(response)
                                if(result.STATUS==='TXN_SUCCESS')
                                {
                                    //store in db
                                    // db.collection('payments').doc('mPDd5z0pNiInbSIIotfj').update({paymentHistory:firebase.firestore.FieldValue.arrayUnion(result)})
                                    // .then(()=>console.log("Update success"))
                                    // .catch(()=>console.log("Unable to update"))
                                    res.redirect("http://localhost:3000/PAYMENTSUCCESS/")
                                }
                                else
                                {
                                    res.redirect("http://localhost:3000/PAYMENTFAILURE/")
                                }
                    });
                });
            
                post_req.write(post_data);
                post_req.end();
            });        

        } else {
            console.log("Checksum Mismatched");
        }
    })
})

router.route("/status/:order_id").get((req,res) =>
{
    console.log(req.params.order_id);
    res.json({ORDERID:req.params.order_id})
})

module.exports = router;

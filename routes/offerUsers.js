var router = require("express").Router();
var OfferUser = require("../models/offerUser.model");

router.route("/").get((req,res) => {
    res.json("list of offer users");
})

router.route("/add").post((req,res)=>
{
    var today = new Date();
    var time = today.getHours()
    var startDate = today 
    console.log(time);
    if(time>17)
    { 
        startDate = new Date(today.getTime() + (1000 * 60 * 60 * 24));
    }
    endDate = new Date(startDate.getTime() + (30 * 1000 * 60 * 60 * 24))
    console.log(startDate,endDate);
    var newOfferUser = new OfferUser ({
        name:req.body.name,
        phoneNumber:req.body.phoneNumber,
        startDate:startDate,
        endDate:endDate,
    });
    console.log(newOfferUser);
    newOfferUser.save()
    .then(() => res.json("offer User added"))
    .catch((err) => res.status(400).json("Error"+err));
});



module.exports=router;

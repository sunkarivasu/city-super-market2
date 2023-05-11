var router = require("express").Router();
const { json } = require("express/lib/response");
var Offer = require("../models/offer.model");

router.route("/").get((req,res)=>
{
    Offer.find()
    .then((offers) => res.json(offers))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/add").post((req,res)=>
{
    var todaysTime = new Date().getTime()
    console.log(todaysTime);
    var todaysDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)))
    console.log(new Date(todaysTime - (todaysTime%(1000*60*60*24))));
    console.log(new Date(todaysTime - (todaysTime%(1000*60*60*24))) + (1000*60*60*5.5));
    var newOffer = new Offer ({
        productName:req.body.productName,
        worth:req.body.price,
        description:req.body.description,
        image:req.body.image,
        date:todaysDate,
    });
    console.log(newOffer);
    newOffer.save()
    .then(() => res.json("offer added"))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/generateWinner").get((req,res)=>
{
    Offer.find()
    .then((offers) => res.json(offers))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/idNo/:idNumber").get((req,res) =>
{
    Offer.findById(req.params.idNumber)
    .then((offer) => {res.json(offer)})
    .catch((err) => {res.status(400).json("Error:"+err)});
});

router.route("/updateOfferDetails/").put((req,res) =>
{
    console.log(req.body);
    Offer.findByIdAndUpdate(req.body._id,{productName:req.body.productName,worth:req.body.worth,winnerName:req.body.winnerName,image:req.body.image,winnerImage:req.body.winnerImage})
        .then(() => {console.log("Offer updated successfully");res.send({})})
        .catch((err) => {console.log("Error Occured While updating offer details");})
});

router.route("/getTodaysWinner").get((req,res) =>
{
    console.log("fetching today's offer");
    var today = new Date()
    console.log(today);
    var todayStartTime = new Date(today.getFullYear(),today.getMonth(),today.getDate())
    var todayEndTime = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1)
    console.log(todayEndTime,todayStartTime);
    Offer.findOne({date:{
        $gte : todayStartTime,
        $lte : todayEndTime 
    }})
    .then((offer) =>
    {
        return res.json(offer)
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching today's winner",err);
    })
})

router.route("/getYesterdaysWinner").get((req,res) =>
{
    var today = new Date()
    console.log(today);
    var yesterday = new Date(today.getTime() - (1000 * 60 * 60 * 24))
    console.log(yesterday.getFullYear(),yesterday.getMonth(),yesterday.getDate());
    console.log(yesterday.getFullYear(),yesterday.getMonth(),yesterday.getDate()+1);
    console.log(typeof yesterday.getDate());
    var yesterdayStartTime = new Date(yesterday.getFullYear(),yesterday.getMonth(),yesterday.getDate())
    // var yesterdayStartTime = new Date(20023,5,15,5)
    var yesterdayEndTime = new Date(yesterday.getFullYear(),yesterday.getMonth(),yesterday.getDate()+1)
    // var yesterdayEndTime = new Date(2023,5,3)
    Offer.findOne({
        date:{
            $gte: yesterdayStartTime,
            $lte: yesterdayEndTime
    }}) 
    .then((offer) =>
    {
        console.log(offer);
        return res.json(offer)
    })
    .catch((err) =>
    {
        console.log("error occured while fetching today's winner",err);
    })
})

router.route("/getTodaysOffer").get((req,res) =>
{
    console.log("fetching today's offer");
    var today = new Date()
    console.log(today);
    var todayStartTime = new Date(today.getFullYear(),today.getMonth(),today.getDate())
    var todayEndTime = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1)
    console.log(todayEndTime,todayStartTime);
    Offer.findOne({date:{
        $gte : todayStartTime,
        $lte : todayEndTime 
    }})
    .then((offer) =>
    {
        return res.json(offer)
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching today's winner",err);
    })
})



module.exports=router;

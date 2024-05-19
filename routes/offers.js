var router = require("express").Router();
const { json } = require("express/lib/response");
var Offer = require("../models/offer.model");
var OfferUser = require("../models/offerUser.model");

router.route("/").get((req,res)=>
{
    Offer.find().sort({date:-1})
    .then((offers) => res.json(offers))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/previousWinners").get((req,res)=>
{
    var date = new Date();
    console.log("---------------------------------");
    console.log("Fetching previous winner... at", date);
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    var todaysTime = today.getTime()
    console.log({today});
    var hours = today.getHours()
    console.log({hours});
    if(hours >= 17)
        var startDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)) - (1000*60*60*24))
    else
        var startDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)) - (1000*60*60*24*2))
    console.log({startDate});
    Offer.find({
        date:{
            $lte:startDate
        }
    })
    .then((offers) => {
        console.log({offers});
        res.json(offers);
        console.log("---------------------------------");
    })
    .catch((err) => res.status(400).json("Error"+err));

});

router.route("/add").post((req,res)=>
{
    console.log("---------------------------------");
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    var todaysTime = today.getTime()
    console.log(todaysTime);
    var todaysDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)))
    var newOffer = new Offer ({
        productName:req.body.productName,
        worth:req.body.price,
        description:req.body.description,
        image:req.body.image,
        date:todaysDate,
    });
    console.log(newOffer);
    newOffer.save()
    .then(() => {
        res.json("offer added");
        console.log("---------------------------------");
})
    .catch((err) => res.status(400).json("Error"+err));

});

// router.route("/generateWinner").get((req,res)=>
// {
//     console.log("---------------------------------");
//     Offer.find()
//     .then((offers) => res.json(offers))
//     .catch((err) => res.status(400).json("Error"+err));
//     console.log("---------------------------------");
// });

router.route("/idNo/:idNumber").get((req,res) =>
{
    console.log("---------------------------------");
    Offer.findById(req.params.idNumber)
    .then((offer) => {
        res.json(offer)
        console.log("---------------------------------");
    })
    .catch((err) => {res.status(400).json("Error:"+err)});
});

router.route("/updateOfferDetails/").put((req,res) =>
{
    console.log("---------------------------------");
    console.log(req.body);
    Offer.findByIdAndUpdate(req.body._id,{productName:req.body.productName,worth:req.body.worth,winnerName:req.body.winnerName,image:req.body.image,winnerImage:req.body.winnerImage})
        .then(() => {
            console.log("Offer updated successfully");
            res.send({});
            console.log("---------------------------------");
        })
        .catch((err) => {console.log("Error Occured While updating offer details");})
});

router.route("/getTodaysWinner").get((req,res) =>
{
    console.log("---------------------------------");
    console.log("fetching today's winner");
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    var todaysTime = today.getTime()
    var todaysDate = new Date(todaysTime - (todaysTime%(1000 * 60 * 60 * 24)))
    console.log(today,todaysDate);
    Offer.findOne({date:todaysDate})
    .then((offer) =>
    {
        console.log("---------------------------------");
        return res.json(offer)
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching today's winner",err);
    })
})

router.route("/generateTodaysWinner").get((req,res) =>{
        console.log("---------------------------------");
        console.log("generating todays winner");
        var TodaysDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5));
        var todaysTime = TodaysDate.getTime()
        var today = new Date(todaysTime - (todaysTime%(1000 * 60 * 60 * 24)))
        OfferUser.find(
            {
                endDate:{
                    $gte:today
                },
                startDate:{
                    $lte:today
                },
                alreadyWinner:false
            }
        )
        .then((offerUsers) =>
        {
            console.log({offerUsers});
            var numberOfUsers = offerUsers.length
            if(numberOfUsers == 0)
            {
                console.log("No offer users found");
            }
            else
            {
                var winnerIndex = Math.floor(Math.random() * (numberOfUsers))
                var winner = offerUsers[winnerIndex]
                console.log("winner:",winner);
                console.log("date:",today);
                // var todayTime = new Date().getTime()
                // var startOfToday = new Date(todayTime - (todayTime%(1000*60*60*24)))
                // console.log({startOfToday});
                Offer.findOne(
                    {
                        date:today,
                    }
                )
                .then((offer) =>
                {
                    console.log({offer});
                    // for(var i=0;i<offers.length;i++)
                    // {
                    //     var todayTime = new Date().getTime()
                    //     var endOfToday = (startOfToday + (1000*60*60*24))
                    //     if(offers[i].date.getTime() >= startOfToday && offers[i].date.getTime() <= endOfToday)
                    //     {
                    //         exactOffer = offers[i]
                    //         break
                    //     }
                    // }
                    if(!offer)
                    {
                        // send message to admin & developer that no offer is added
                        console.log("No offer added...");
                    }
                    else
                    {
                        //send message to admin & developer that winner is genderated
                        Offer.findOneAndUpdate({date:today},{winnerName:winner.name,winnerPhoneNumber:winner.phoneNumber})
                        .then(() =>
                        {
                            OfferUser.findOneAndUpdate({
                                    _id:winner._id
                            },{
                                alreadyWinner:true
                            })
                            .then((offerUser) =>{
                                console.log("alreadyWinner attribute is set");
                                console.log("winner generated successfully...");
                                console.log("---------------------------------");
                                res.send({});
                            })
                            .catch((err) =>{
                                res.status(400).json("Error"+err);
                                console.log("Error occured while setting alreadyWinner attribute..",err);
                            })
                        })
                        .catch((err) =>
                        {
                            res.status(400).json("Error"+err);
                            console.log("Error occured while generating winner...",err);
                        })
                    }
                })
                .catch((err) =>
                {
                    res.status(400).json("Error"+err);
                    console.log("Error occured while generating winner...",err);
                })
            }

        })
        .catch((err) =>
        {
            res.status(400).json("Error"+err)
            console.log("Error occured while fetchnig offerUsers count",err);
        })
})

router.route("/getYesterdaysWinner").get((req,res) =>
{
    console.log("---------------------------------");
    console.log("fetching yesterday's winner");
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    console.log({today});
    var todayTime = today.getTime()
    console.log(today);
    var yesterday = new Date(todayTime - (todayTime%(1000 * 60 * 60 * 24))  - (1000 * 60 * 60 *24))
    console.log({yesterday});
    Offer.findOne({
        date: yesterday,
    })
    .then((offer) =>
    {
        console.log("---------------------------------");
        console.log(offer);
        res.json(offer)
    })
    .catch((err) =>
    {
        console.log("error occured while fetching today's winner",err);
    })
})

router.route("/getTodaysOffer").get((req,res) =>
{
    console.log("---------------------------------");
    console.log("fetching today's offer");
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    var todaysTime = today.getTime()
    var todaysDate = new Date(todaysTime - (todaysTime%(1000 * 60 * 60 * 24)))
    console.log(today,todaysDate);
    Offer.findOne({date:todaysDate})
    .then((offer) =>
    {
        console.log("---------------------------------");
        res.json(offer)
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching today's winner",err);
    })
})


module.exports=router;

var router = require("express").Router();
var OfferUser = require("../models/offerUser.model");

router.route("/").get((req,res) => {
    OfferUser.find({})
    .then((users) =>
    {
        res.json(users);
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching offer users",err);
    })
})

router.route("/add").post((req,res)=>
{
    console.log(req.body);
    var today = new Date();
    var todaysTime = today.getTime();
    var time = today.getHours()
    var startDate = new Date(todaysTime - (todaysTime%(1000 * 60 * 60 * 24)))
    var noOfDays = 30
    if(req.body.noOfDays !== "")
        noOfDays = parseInt(req.body.noOfDays)
    console.log(time);
    if(time>17)
    { 
        console.log({time});
        startDate = new Date(startDate.getTime() + (1000 * 60 * 60 * 24));
    }
    endDate = new Date(startDate.getTime() + (noOfDays * 1000 * 60 * 60 * 24) - (1000 * 60 ))
    console.log(startDate,endDate);
    var newOfferUser = new OfferUser ({
        name:req.body.name,
        phoneNumber:req.body.phoneNumber,
        startDate:startDate,
        endDate:endDate,
    });
    console.log(newOfferUser);
    OfferUser.findOne({phoneNumber:req.body.phoneNumber})
    .then((offerUser) =>{
        if(offerUser)
        {
            res.send({status:false,msg:"PhoneNumber already Exists"})
        }
        else
        {
            newOfferUser.save()
            .then(() => res.send({status:true,msg:"offer User added"}))
            .catch((err) => res.status(400).json("Error"+err));
        }
    })
    
});

router.route("/updateOfferUserDetails/").put((req,res) =>
{
    console.log(req.body);
    if(req.body.noOfDays != "")
    {
        OfferUser.findById(req.body._id)
        .then((offerUser) =>
        {
            var presentDate = new Date();
            console.log(presentDate);
            var time = new Date().getTime();
            console.log(time);
            console.log(offerUser.endDate.getTime());
            var endTime = offerUser.endDate.getTime()
            if(time<endTime)
            {
                console.log("only endDate has to be changed..",offerUser.endDate.getTime() + (parseInt(req.body.noOfDays)*24*60*60*1000));
                var newEndDate =  new Date(offerUser.endDate.getTime() + (parseInt(req.body.noOfDays)*24*60*60*1000))
                console.log({newEndDate});
                var newStartDate = offerUser.startDate
            }
            else
            {
                var today = new Date();
                var todaysTime = today.getTime();
                var time = today.getHours()
                var newStartDate = new Date(todaysTime - (todaysTime%(1000 * 60 * 60 * 24)))
                var noOfDays = 30
                if(req.body.noOfDays !== "")
                    noOfDays = parseInt(req.body.noOfDays)
                console.log(time);
                if(time>17)
                { 
                    console.log({time});
                    newStartDate = new Date(newStartDate.getTime() + (1000 * 60 * 60 * 24));
                }
                newEndDate = new Date(newStartDate.getTime() + (noOfDays * 1000 * 60 * 60 * 24) - (1000 * 60 ))
                console.log(newStartDate,newEndDate);
            }
            console.log(newEndDate,newStartDate);
            OfferUser.findByIdAndUpdate(req.body._id,{name:req.body.name,phoneNumber:req.body.phoneNumber,startDate:newStartDate,endDate:newEndDate})
            .then(() => {console.log("OfferUser updated successfully");res.send({})})
            .catch((err) => {console.log("Error Occured While updating offerUser details",err);})
        })
        .catch((err) =>
        {
            console.log("Error occured while adding days to offerUser",err);
        })
    }
    else
    {
        OfferUser.findByIdAndUpdate(req.body._id,{name:req.body.name,phoneNumber:req.body.phoneNumber})
        .then(() => {console.log("OfferUser updated successfully");res.send({})})
        .catch((err) => {console.log("Error Occured While updating offerUser details");})
    }
    });

router.route("/idNo/:idNumber").get((req,res) =>
{
    OfferUser.findById(req.params.idNumber)
    .then((offerUser) => {res.json(offerUser)})
    .catch((err) => {res.status(400).json("Error:"+err)});
});



module.exports=router;
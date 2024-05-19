var router = require("express").Router();
var UserRequest = require("../models/userRequest.model");

router.route("/").get((req,res) => {
    UserRequest.find({})
    .then((requests) =>
    {
        res.json(requests);
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching user requests",err);
    })
})

router.route("/active").get((req,res) => {
    UserRequest.find({status:""})
    .then((requests) =>
    {
        res.json(requests);
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching user requests",err);
    })
})


router.route("/add").post((req,res)=>
{
    console.log(req.body);
    console.log(req.body.noOfDays);
    var newUserRequest = new UserRequest ({
        name:req.body.name,
        phoneNumber:req.body.phoneNumber,
        noOfDays:req.body.noOfDays
    });
    console.log(newUserRequest);
    UserRequest.findOne({phoneNumber:req.body.phoneNumber})
    .then((userRequest) =>{
        if(userRequest)
        {
            res.send({status:false,msg:"PhoneNumber already Exists"})
        }
        else
        {
            newUserRequest.save()
            .then(() => res.send({status:true,msg:"User Request added"}))
            .catch((err) => res.status(400).json("Error"+err));
        }
    })
});



router.route("/changeStatus").put((req,res) =>
{
    UserRequest.findByIdAndUpdate(req.body.id,{
        status:req.body.status
    })
    .then((userRequest) =>{
        res.send({})
        console.log(userRequest);
    })
    .catch((err) =>{
        console.log("Error occured while changing status",err);
    })
});

router.route("/idNo/:idNumber").get((req,res) =>
{
    UserRequest.findById(req.params.idNumber)
    .then((userRequest) => {res.json(userRequest)})
    .catch((err) => {res.status(400).json("Error:"+err)});
});

router.route("/updateUserRequest").put((req,res) =>
{
    console.log(req.body);
    UserRequest.findByIdAndUpdate(req.body._id,{name:req.body.name,phoneNumber:req.body.phoneNumber,noOfDays:req.body.noOfDays})
    .then(() => {console.log("User Request updated successfully");res.send({})})
    .catch((err) => {console.log("Error Occured While updating offerUser details");})
});




module.exports=router;
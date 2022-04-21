const router = require('express').Router();
var User = require("../models/user.model");
var mongoose = require("mongoose"); 
var passport = require("passport");
var {hashSync,compareSync} = require("bcrypt");
var jwt = require("jsonwebtoken");
const Product = require('../models/product.model');

require("../config/passport");



router.route("/").get((req,res)=>
{
    User.find({})
    .then((user) => {res.json(user)})
    .catch((err) => {res.status(400).json("Error:"+err)});
})

router.route("/getUserDetailsById/:userId").get((req,res) =>
{
    User.findById({_id:req.params.userId})
        .then((user) => res.json(user))
        .catch((err) => res.json(400).json("Error:"+err))
})

router.route("getuserId/:userId").get(passport.authenticate("jwt",{session:false}),(req,res)=>
{
    User.findOne({_id:req.params.userId})
    .then((user) => res.json(user))
    .catch((err) => {res.status(400).json("Error:"+err)});
})

router.route("/registerAdmin").post((req,res)=>
{
    var admin =  new User(
        {
            emailId:req.body.emailId,
            password:hashSync(req.body.password,10),
            isAdmin:true
        }
    ) 
    admin.save()
    .then(()=>{res.json("registered successfully")})
    .catch((err) =>{
        res.json("Error occured while registering admin:"+err);
    })
})

router.route("/loginAdmin").post((req,res)=>
{
    User.findOne({emailId:req.body.emailId,isAdmin:true})
    .then((admin) => {
        //console.log("user details"+user)
        if(admin==null)
        {
            res.send({
                msg:"Invalid credentials",
                success:false,
            })
        }
        else
        {
            if(!compareSync(req.body.password,admin.password))
            {
                res.send({
                    msg:"Invalid credentials",
                    success:false
                })
            }
            else
            {
                const jwt_payload = {
                    id:admin._id,
                    emailId:admin.emailId
                } 

                const token = jwt.sign(jwt_payload,"something",{expiresIn:"1d"})
                res.send({
                    msg:"Login success",
                    success:true,
                    token:"Bearer "+token,
                    admin:admin
                })
            }
        }
    })
    .catch((err) =>{console.log("error:"+err)})
})

router.route("/checkEmailId/:emailId").get((req,res) =>
{
    console.log(req.params.emailId);
    User.findOne({emailId:req.params.emailId})
    .then((user)=>
    {
        console.log(user);
        if(user)
        {
            res.send({
                msg:"EmailId Already exists",
                success:false,
                err:null
            })
        }   
        else
        {
            res.send({
                msg:"",
                success:true,
                err:null
            })
        }      
    })
    .catch((err)=>
    {
        res.json(console.log("Error:"+err)); 
    })
})

router.route("/add").post((req,res) =>
{
    // console.log(req.body);
    User.findOne({emailId:req.body.emailId})
    .then((user) =>{
        if(user)
        {
            res.send(
                {
                    msg:"EmailId already exists",
                    success:false,
                    err:false
                }
            )
        }
        else
        {
            const newUser = new User(
                {
                    name:req.body.name,
                    password:hashSync(req.body.password,10),
                    emailId:req.body.emailId,
                    phoneNumber:req.body.mobile,
                    cartItems:[],
                    isAdmin:false
                });
            newUser.save()
            .then(() => res.send(
                {
                    success:true,
                    msg:"Registered successfully",
                    err:false
                }
            ))
            .catch((err) => res.send(
                {
                    success:false,
                    err:err,
                    msg:"Error occured while registering the user."
                })
            );        
        }})
    });

router.route("/login").post((req,res)=>
{
    // console.log("Trying to login");
    User.findOne({emailId:req.body.emailId})
    .then((user) => {
        console.log("user details"+user)
        if(user==null)
        {
            res.send({
                msg:"User Not Found",
                success:false,
            })
        }
        else
        {
            if(!compareSync(req.body.password,user.password))
            {
                res.send({
                    msg:"Incorrect Password",
                    success:false
                })
            }
            else
            {
                const jwt_payload = {
                    id:user._id,
                    emailId:user.emailId
                } 

                const token = jwt.sign(jwt_payload,"something",{expiresIn:"1d"})
                res.send({
                    msg:"Login success",
                    success:true,
                    token:"Bearer "+token,
                    user:user
                })
            }
        }
    })
    .catch((err) =>{console.log("error:"+err)})
})

router.route("/addToCart/:userId/:itemId").post((req,res) =>
{
    User.updateOne({_id:req.params.userId},{$push:{cartItems:{productId:req.params.itemId,orderQuantity:1}}})
    .then(() => {res.json("product added to cart")})
    .catch((err) => {res.status(400).json(err)})
})

router.route("/removeFromCart/:userId/:itemId").post((req,res) =>
{
    User.updateOne({_id:req.params.userId},{$pull:{cartItems:{productId:mongoose.Types.ObjectId(req.params.itemId)}}})
    .then(() => {res.json("product removed from cart")})
    .catch((err) => {res.status(400).json(err)})
})

router.route("/inCartOrNot/:userId/:itemId").get((req,res) =>
{
    User.findOne({_id:req.params.userId})
    .then((user) =>{
        var returned = false
        if(user)
        {
            user.cartItems.map( (product) =>
            {
                if(product.productId==req.params.itemId)
                {
                    res.json(true)
                    returned = true;
                }
            })
            if(!returned)
                res.json(false)
        }
        else
            res.json(false)
        })
    .catch((err) => {res.status(400).json("Error occured while checking in cart"+err)})
    // User.find({"cartItems":{$in:[req.params.itemId]}},{_id:req.params.userId})
    // .then((user) =>{
    //     if(user.length>0)
    //         res.json(true)
    //     else
    //         res.json(false)
    //     })
    // .catch((err) => {res.status(400).json("Error occured while checking in cart"+err)})
})

router.route("/cartItems/:userId").get((req,res) =>
{
    // console.log(req.params.userId);
    User.findOne({_id:req.params.userId})
    .then(async (user) => {
        var cartIds = user.cartItems;
        var cartItems =[]
        for(var i=0;i<cartIds.length;i++)
        {
            await Product.findOne({_id:cartIds[i].productId})
            .then((product) => {
                // orderQuantity=cartIds[i].orderQuantity
                result={_id:product._id,
                    category:product.category,
                    subCategory:product.subCategory,
                    image:product.image,
                    brand:product.brand,
                    price:product.price,
                    description:product.description,
                    discount:product.discount,
                    quantity:product.quantity,
                    orderQuantity:cartIds[i].orderQuantity }
                console.log(result);
                if(product)
                {
                    cartItems.push(result)
                }
                else
                {
                    User.updateOne({_id:req.params.userId},{$pull:{cartItems:{productId:cartIds[i].productId}}})
                .then(()=>{console.log("Removed a product from cart because product is deleted by admin")})
                .catch((err)=>{console.log("Error:"+err)})
                } 
            })
            .catch((err) => {res.status(400).json("Error while fetching cart Items:"+err)});
        }
        res.json(cartItems);        
    });
})


router.route("/removeAllProductFromCartByUserId").post((req,res)=>
{
    User.updateOne({_id:req.body.userId},{$set:{cartItems:[]}})
    .then(()=>{
        res.send("All items removed successfully");
    })
    .catch((err)=>
    {
        res.status(400).send("Error occured while removing all the cart items"+err)
    })
})

router.route("/increaseQuantity").post((req,res) =>
{
    User.updateOne({_id:req.body.userId,"cartItems.productId":req.body.productId},{$inc:{"cartItems.$.orderQuantity":1}})
    .then(() => res.send("qunatity increased successfully"))
    .catch((err) => res.status(400).send("Error occured while increasing the quantity"))
})

router.route("/decreaseQuantity").post((req,res) =>
{
    User.updateOne({_id:req.body.userId,"cartItems.productId":req.body.productId},{$inc:{"cartItems.$.orderQuantity":-1}})
    .then(() => res.send("qunatity decreased successfully"))
    .catch((err) => res.status(400).send("Error occured while decreasing the quantity"))
})

module.exports = router;
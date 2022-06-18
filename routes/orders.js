var router = require("express").Router();
const { default: mongoose } = require("mongoose");
var Order = require("../models/order.model");
var Product = require("../models/product.model");
var User = require("../models/user.model");


router.route("/").get((req,res)=>
{
    Order.find({})
    .then((orders)=>
    {
        res.send(orders);
    })
    .catch((err) =>{
        res.status(400).send("Error:"+err)
    })
})

router.route("/add").post((req,res)=>
{
    console.log(req.body);
    var newOrder = new Order (
        {
            userId:req.body.userId,
            productId:req.body.productId,
            amount:req.body.amount,
            quantity:req.body.quantity,
            deliveryAddress:req.body.deliveryAddress
        })
    newOrder.save()
    .then(()=>
    {
        Product.updateOne({_id:req.body.productId},{$inc:{quantity:-req.body.quantity}})
        .then(()=>{
            User.updateOne({_id:req.body.userId},{$set:{cartItems:[]}})
            .then(()=>
            {
                res.send();
                console.log("Order placed successfully");
            })
            .catch((err)=>{
                console.log("Error while placing order and emptying user cartItems:"+err);
            }) 
        })
        .catch((err)=>{
            console.log("Error while placing order and updating product collection:"+err);
        })  
    })
    .catch((err) =>
    {
        console.log("Error occured while placing order:"+err);
    })
});


// router.route("/placeOrderFromCart/").post((req,res)=>
// {

// })

router.route("/getOrdersByUserId/:userId").get((req,res)=>
{
    var id = mongoose.Types.ObjectId(req.params.userId)
    //console.log("UserId:"+id);
    //Order.aggregate([{$match:{userId:id}}])
    Order.aggregate([{$match:{userId:id}},{
        $lookup:{
            from:"products",
            localField:"productId",
            foreignField:"_id",
            as:"productDetails"
        }
    }])
    .then((orders)=>
    {
        res.send(orders)
    })
    .catch((err)=>
        {
            console.log("Error occured while joining products and orders collections:"+err)
        })
    // Order.find({_id:req.params.userId})
    // .then((orders)=>
    // {
    //     orders.forEach((order) =>
    //     {
    //         var productDetails = Product.findOne({_id:order.productId})
    //     })
    // })
    // .then(
    // Order.find({userId:req.params.userId})
    // .then((orders) =>
    // {
    //     res.send(orders)
    // }))
    // .catch((err) =>
    // {
    //     res.status(400).send("Error:"+err);
    // })
});

module.exports=router;
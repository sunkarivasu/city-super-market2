var router = require("express").Router();
var Offer = require("../models/offer.model");

router.route("/add").post((req,res)=>
{
    var newOffer = new Offer ({
        productName:req.body.productName,
        worth:req.body.price,
        description:req.body.description,
        image:req.body.image,
        date:new Date()
    });
    console.log(newOffer);
    newOffer.save()
    .then(() => res.json("offer added"))
    .catch((err) => res.status(400).json("Error"+err));
});

module.exports=router;

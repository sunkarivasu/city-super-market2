var router = require("express").Router();
const { json } = require("express/lib/response");
var NormalOffer = require("../models/normalOffer.model");

router.route("/").get((req,res)=>
{
    NormalOffer.find({status:"Active"})
    .then((offers) => res.json(offers))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/add").post((req,res)=>
{
    var newNormalOffer = new NormalOffer ({
        productName:req.body.productName,
        price:req.body.price,
        description:req.body.description,
        image:req.body.image,
        discount:req.body.discount
    });
    console.log(newNormalOffer);
    newNormalOffer.save()
    .then(() => res.json("normal offer added"))
    .catch((err) => res.status(400).json("Error"+err));
});


router.route("/idNo/:idNumber").get((req,res) =>
{
    NormalOffer.findById(req.params.idNumber)
    .then((offer) => {res.json(offer)})
    .catch((err) => {res.status(400).json("Error:"+err)});
});

router.route("/updateNormalOfferDetails/").put((req,res) =>
{
    console.log(req.body);
    NormalOffer.findByIdAndUpdate(req.body._id,{productName:req.body.productName,price:req.body.price,image:req.body.image,discount:req.body.discount,description:req.body.description})
        .then(() => {console.log("NormalOffer updated successfully");res.send({})})
        .catch((err) => {console.log("Error Occured While updating NormalOffer details");})
});

router.route("/delete/:offerId").delete((req,res) =>
{
    NormalOffer.findByIdAndDelete(req.params.offerId)
        .then(() => {console.log("Normal Offer Deleted: "+req.params.offerId)
        res.send({})
        })
        .catch((err) => res.status(400).json("Error occured while deleting product"));

})

router.route("/changeStatus/:offerId").post((req,res) =>
{
    console.log(req.params.offerId,req.body.status);
    console.log(req.body.status === false?"InActive":"Active");
    NormalOffer.updateOne({_id:req.params.offerId},{$set:{status:req.body.status === false?"InActive":"Active"}})
        .then(() => {console.log("status changed for Normal Offer:"+req.params.offerId)
        res.send({})
        })
        .catch((err) => res.status(400).json("Error occured while deleting product"));
})




module.exports=router;

const router = require("express").Router();
var Category = require("../models/category.model");
var async = require("async");
var Product = require("../models/product.model");
const Order = require("../models/order.model");
const { get } = require("express/lib/response");
// const { default: mongoose } = require("mongoose");



router.route("/").get((req,res) =>
{
    Product.find()
    .then(products =>res.json(products))
    .catch(error => res.status(400).json("Error"+error));
});

router.route("/idNo/:idNumber").get((req,res) =>
{
    // console.log(req.params.idNumber);
    Product.findById(req.params.idNumber)
    .then((product) => {res.json(product)})
    .catch((err) => {res.status(400).json("Error:"+err)});
});

router.route("/category/:categoryName").get((req,res)=>
{
    // console.log(req.params.categoryName);
    Product.find({category:req.params.categoryName})
    .then(products => res.json(products))
    .catch(err => res.status(400).json("Error"+err));
});

router.route("/add").post((req,res)=>
{
    var newProduct = new Product ({
        category:req.body.category,
        subCategory:req.body.subCategory,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        description:req.body.description,
        discount:req.body.discount,
        quantity:req.body.quantity
    });

    newProduct.save()
    .then(() => res.json("product added"))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/noOfProducts/:number").get((req,res) =>
{
    Category.find({})
    .then( async (categoryResult) =>
    {
        var categoryTopList=[];
        // console.log(categoryTopList);
            for(var i=0;i<categoryResult.length;i++)
            {
                await Product.find({category:categoryResult[i].categoryName}).limit(req.params.number)
                .then((productResult) => { 
                    if(productResult.length)
                        categoryTopList.push(productResult)
                // console.log("pushed")
            })
                .catch((err) => {console.log(err)});   
            }
            // console.log(categoryTopList);
            res.json(categoryTopList);                
    })
    .catch((err) => {console.log(err)})
});

router.route("/searchProductDetailsToUpdate/:category/:subCategory/:productName").get((req,res) =>
{
    Product.find({category:req.params.category,subCategory:req.params.subCategory,brand:req.params.productName})
    .then((products)=>{res.json(products)})
    .catch(() => {res.status(400).json("Error while searching product details to update:"+err)});
})

router.route("/updateProductDetails/").put((req,res) =>
{
    Product.findByIdAndUpdate(req.body._id,{category:req.body.category,subCategory:req.body.subCategory,brand:req.body.brand,quantity:req.body.quantity,price:req.body.price,discount:req.body.discount,image:req.body.image,description:req.body.description})
        .then(() => {console.log("Product updated successfully");res.send({})})
        .catch((err) => {console.log("Error Occured While updating prodcut details");})
    // Product.updateOne({category:req.body.category,subCategory:req.body.subCategory,brand:req.body.brand},{$set:{quantity:req.body.quantity,price:req.body.price,discount:req.body.discount,image:req.body.image,description:req.body.description}})
    // .then(() => {res.json("product updated")})
    // .catch(() => {res.status(400).json("Error occured while updating the product:"+err)});
});

router.route("/delete/:productId").delete((req,res) =>
{
    Product.findByIdAndDelete(req.params.productId)
        .then(() => {console.log("Producted Deleted: "+req.params.productId)
        Order.remove({productId:req.params.productId})
            .then(()=>
            {res.json("product deleted in the orders collection by admin");})
            .catch((err)=>{res.status(400).json("Error occured while deleting Order beacause of deleteing product")})
        })
        .catch((err) => res.status(400).json("Error occured while deleting product"));

})


router.route("/getProductsByCategory/:category").get((req,res)=>
{
    Product.find({category:req.params.category})
    .then((products) =>{
        res.json(products)
    })
    .catch((err) => res.status(400).json("Error occured while fetching products by category"))
})

router.route("/getProductsByCategoryAndSubCategory/:category/:subCategory").get((req,res)=>
{
    Product.find({category:req.params.category,subCategory:req.params.subCategory})
    .then((products) =>{
        res.json(products)
    })
    .catch((err) => res.status(400).json("Error occured while fetching products by category and sub category"))
})



module.exports = router;
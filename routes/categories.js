var router = require("express").Router();
var Category = require("../models/category.model");



router.route("/").get((req,res)=>
{
    Category.find()
    .then(categories => res.json(categories))
    .catch(error => res.status(400).json("Error:"+error));
});

router.route("/getCategoryDetails/:categoryName").get((req,res)=>
{
    Category.findOne({categoryName:req.params.categoryName})
    .then((categories)=>{res.send(categories)})
    .catch((err)=>{res.status(400).send("Error occured while fetching catagory details")});
})

router.route("/add").post((req,res)=>
{
    console.log(req.body);
    
    var newCategory = new Category(
        {
            categoryName:req.body.category,
            categoryImage:req.body.categoryImage,
            subCategoryList:req.body.subCategoryList
        }
    );

    newCategory.save()
    .then(() => res.json("category added"))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/getCategories").get((req,res) =>
{
    Category.find({},{_id:0,categoryName:1})
    .then((categories) => res.json(categories))
    .catch((err) => {res.status(400).json("Error while fetching categories:"+err)});
});

router.route("/updateCategoryDetails/").put((req,res) =>
{
    Category.updateOne({categoryName:req.body.category},{$set:{subCategoryList:req.body.subCategoryList,categoryImage:req.body.categoryImage}})
    .then(()=>{res.json("Category updated successfully")})
    .catch(()=>{res.status(400).json("Error:"+err)})
});

router.route("/getSubCategories/:categoryName").get((req,res) =>
{
    Category.findOne({categoryName:req.params.categoryName},{_id:0,subCategoryList:1})
    .then((result) => {res.json(result.subCategoryList)})
    .catch((err) =>{res.status(400).json("Error:"+err)})
});




router.route("/getCategoryDetails/:categoryName").get((req,res) =>
{
    Category.findOne({categoryName:req.params.categoryName})
    .then((result) => {res.json(result)})
    .catch((err) =>{res.status(400).json("Error:"+err)})
});

router.route("/deleteCategory/:categoryName").delete((req,res) =>
{
    Category.deleteOne({categoryName:req.params.categoryName})
    .then(() => {res.json("Category Deleted")})
    .catch((err) =>{res.status(400).json("Error:"+err)});
})

module.exports=router;
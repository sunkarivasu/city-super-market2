var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema(
    {
        categoryName:String,
        categoryImage:String,
        subCategoryList:[
            String
        ]
    }
);

var Category = mongoose.model("category",categorySchema);

module.exports=Category;
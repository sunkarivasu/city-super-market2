import react, { useEffect,useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function AdminShowAllProducts(props)
{

    var [categoryList,setCategoryList] = useState(null);
    var [category,setCategory] = useState("None");
    var [subCategoryList,setSubCategoryList] = useState(null);
    var [subCategory,setSubCategory] = useState("All");
    var [products,setProducts] = useState(null);
    var [productDeleted,setProductDeleted] = useState(false);

    useEffect(() => {

        axios.get("/categories/")
                .then((res) => {
                    setCategoryList(res.data)})
                .catch((err) => console.log("Error Occured while fetching categories"))

        if(category=="None" && subCategory=="All")
            axios.get("/products/")
            .then((res) => {
                setProducts(res.data.reverse())})
            .catch((err) => console.log("Error Occured while fetching products"))
        else if(subCategory=="All")
            axios.get("/products/getProductsByCategory/"+category)
                .then((res) => setProducts(res.data.reverse()))
                .catch((err) => console.log("Error Occured while fetching products"))
        else
            axios.get("/products/getProductsByCategoryAndSubCategory/"+category+"/"+subCategory)
                .then((res) => setProducts(res.data.reverse()))
                .catch((err) => console.log("Error Occured while fetching products"))
        
        
        setProductDeleted(false);

        return () => {}
    },[category,subCategory,productDeleted]);


    function handleChangeCategory(event)
    {
        setCategory(event.target.value);
        if(event.target.value=="None")
        {
            setSubCategoryList(null)
            setSubCategory("All")
        }
        else
            axios.get("/categories/getSubCategories/"+event.target.value)
            .then((res) => {setSubCategoryList(res.data);
            console.log(category+" "+subCategoryList)})
            .catch((err) => {console.log("Error while fetching sub categoryList:"+err)}) 
    }

    function handleChangeSubCategory(event)
    {
        setSubCategory(event.target.value);
    }

    function handleDeleteProduct(event)
    {
        console.log(event.target.id);
        axios.delete("/products/delete/"+event.target.id)
            .then(()=>{
                toast.success("Product Deleted successfully",{position:toast.POSITION.BOTTOM_CENTER,backgroundColor:"black",color:"white"});
                console.log("Product Deleted successfully")})
            .catch((err) => {console.log("Error occured while deleting a product"+err);})
        setProductDeleted(true);   
    }

    function handleEditProduct(event)
    {
        props.handleEditProduct(event.target.id);
    }


    return <div className="adminShowAllProducts">
        <div className="adminShowAllProducts-navbar">
            <div className="navbar-category">
                <label style={{fontWeight:"500",fontSize:"1.1rem"}}>Category</label>
                <select className="category-select" style={{width:"150px"}} value={category} onChange={handleChangeCategory}>
                <option value="None">All</option>
                {categoryList && categoryList.map((category) => {return <option value={category.categoryName}>{category.categoryName}</option>})}
                </select>
            </div>
            <div>
                <div className="navbar-subCategory">
                    <label style={{fontWeight:"500",fontSize:"1.1rem"}}>Sub Category</label>
                    <select className="subCategory-select" style={{width:"250px"}} value={subCategory} onChange={handleChangeSubCategory}>
                        <option value="All">All</option>
                        {subCategoryList && subCategoryList.map((subCategory) => {return <option value={subCategory}>{subCategory}</option>})}
                    </select>
                </div>
                <div className="navbar-category">
                    <button className="navbar-showProduct-search" style={{display:"none"}}><FaSearch/></button>
                </div>
            </div>
            
        </div>
        <div style={{display:"block"}}>
                <button className="btn btn-secondary admin-add-product-home-btn" onClick={props.handleAddProduct}>Add Product</button>
            </div>
        <div className="productList-titles row">
            <div className="col-2" style={{fontWeight:"600"}}>Image</div>
            <div className="col-4" style={{fontWeight:"600"}}>Brand</div>
            <div className="col-1" style={{fontWeight:"600"}}>M.R.P</div>
            <div className="col-1" style={{fontWeight:"600"}}>Discount</div>
            <div className="col-1" style={{fontWeight:"600"}}>Price</div>
            <div className="col-1" style={{fontWeight:"600"}}>Quantity</div>
            <div className="col-2" style={{fontWeight:"600"}}></div>
        </div>
        <div className="subCategory-container">
            {products?<div>
                {products.map((product) => {return <div className="productList-item row">
                    <div className="productList-item-img col-2">
                        <img src={product.image} style={{width:"80px",height:"80px"}}/>
                    </div>
                    <div className="productList-item-brand col-4" style={{textAlign:"left"}}>
                        <p style={{margin:"25px 0px",fontWeight:"500",textTransform:"capitalize"}}>{product.brand}</p>
                    </div>
                    <div className="productList-item-price col-1">
                        <p style={{margin:"25px 0px"}}>Rs {product.price}</p>
                    </div>
                    <div className="productList-item-discount col-1">
                        <p style={{margin:"25px 0px"}}>{product.discount}%</p>
                    </div>
                    <div className="productList-item-price col-1">
                        <p style={{margin:"25px 0px"}}>Rs {Math.round(product.price*(100-product.discount)/100)}</p>
                    </div>
                    <div className="productList-item-quantity col-1">
                        <p style={{margin:"25px 0px"}}>{product.quantity}</p>
                    </div>
                    <div className="productList-item-edit col-2">
                        <button className="btn btn-secondary productList-item-edit-btn" style={{margin:"25px 10px 25px 0px"}} id={product._id} onClick={handleEditProduct}>Edit</button>
                        <button className="btn btn-secondary productList-item-delete-btn" style={{margin:"25px 0px"}} id={product._id} onClick={handleDeleteProduct}>Delete</button>
                    </div>
                </div>})}
            </div>:<div>Loading...</div>}
        </div>
    </div>
}

export default AdminShowAllProducts;
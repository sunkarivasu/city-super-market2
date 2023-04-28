import {React} from "react";
import "../css/style.css";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import AdminAddProduct from "./AdminAddProduct.component";
import AdminUpdateProduct from "./AdminUpdateProduct.component";
import AdminDeleteProduct from "./AdminDeleteProduct.component";
import AdminAddCategory from "./AdminAddCategory.component";
import AdminUpdateCategory from "./AdminUpdateCategory.component";
import AdminDeleteCategory from "./AdminDeleteCategory.component";
import AdminShowAllProducts from "./AdminShowAllProducts.component";
import AdminAddOffer from "./AdminAddOffer.component";
import AdminAddOfferUser from "./AdminAddOfferUser.component";
import axios from "axios";


function AdminHome()
{
    
    var [showAllProducts,setShowAllProducts] = useState(false);

    var [showAddProduct,setShowAddProduct] = useState(false);
    var [showUpdateProduct,setShowUpdateProduct] = useState(false);
    var [showDeleteProduct,setShowDeleteProduct] = useState(false);

    var [showAddCategory,setShowAddCategory] = useState(false);
    var [showUpdateCategory,setShowUpdateCategory] = useState(false);
    var [showDeleteCategory,setShowDeleteCategory] = useState(false);

    var [showAdminOptions,setShowAdminoptions] = useState(true);

    var [showAddOffer,setShowAddOffer] = useState(true);
    var [showAddOfferUser,setShowAddOfferUser] = useState(false);


    var [editProductId,setEditProductId] = useState(null);

    

    var navigate = useNavigate();

    useEffect(()=>
    {
        // console.log(showUpdateProduct);
        var token = localStorage.getItem("token");
        if(token == null)
        {
            navigate("../AdminLogin");
        }
        else
        {
            axios.get("/checkAdminToken",{headers:{Authorization:token}})
            .then((res)=>{
                console.log(res.data);
            })
            .catch((err) =>{
                navigate("../AdminLogin");});
        
        return  () => {}
        }
        // console.log(token)
        
    },[showUpdateProduct]);
    

    
    function resetOptions()
    {
        setShowAllProducts(false);
        setShowAddProduct(false);
        setShowUpdateProduct(false);
        setShowDeleteProduct(false);
        setShowAddCategory(false);
        setShowUpdateCategory(false);
        setShowDeleteCategory(false);
        setShowAllProducts(false);
        setShowAddOffer(false);
        setShowAddOfferUser(false);
    }

    function handleShowAllProducts()
    {
        resetOptions()
        setShowAllProducts(true);
    }


    function handleAddProduct()
    {
        resetOptions()
        setShowAddProduct(true);
    }

    function handleUpdateProduct(id)
    {
        // console.log(id);
        resetOptions()
        setEditProductId(id);
        setShowUpdateProduct(true);
    }

    function handleDeleteProduct()
    {
        resetOptions()
        setShowDeleteProduct(true);
    }

    function handleAddCategory()
    {
        resetOptions()
        setShowAddCategory(true);
    }

    function handleUpdateCategory()
    {
        // console.log("Hi");
        resetOptions()
        setShowUpdateCategory(true);
    }

    function handleDeleteCategory()
    {
        // console.log("Hi");
        resetOptions()
        setShowDeleteCategory(true);
    }

    function handleAddOffer()
    {
        resetOptions();
        setShowAddOffer(true);
    }

    function handleAddOfferUser()
    {
        resetOptions();
        setShowAddOfferUser(true);
    }

    return (
            <div>
                <nav className="navbar admin-navbar navbar-expand-lg">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <a className="navbar-brand" href="#">CSM</a>
                        {showAdminOptions && <AdminOptions/>}
                        <img className="profile-image" style={{visibility:"hidden"}}></img>
                        <button className="admin-logout-btn" onClick={ () => { 
                            localStorage.removeItem("token");
                            navigate("/adminLogin")
                        }
                        }>Logout</button>
                    </div>
                </nav>
                <div className="admin-home">
                    <div className="adminHomeContainer">
                        {showAllProducts && <AdminShowAllProducts handleAddProduct={handleAddProduct} handleEditProduct={handleUpdateProduct}/>}
                        {showAddProduct && <AdminAddProduct handleShowAllProducts={handleShowAllProducts}/>}
                        {showUpdateProduct && <AdminUpdateProduct productId={editProductId} handleShowAllProducts={handleShowAllProducts}/>}
                        {showDeleteProduct && <AdminDeleteProduct/>}
                        {showAddCategory && <AdminAddCategory/>}
                        {showUpdateCategory && <AdminUpdateCategory/>}
                        {showDeleteCategory && <AdminDeleteCategory/>}
                        {showAddOffer && <AdminAddOffer/>}
                        {showAddOfferUser && <AdminAddOfferUser/>}
                    </div>
                </div>
            </div>
    );

    function AdminOptions()
    {
        return (
                <ul className="navbar-nav ms-auto  mt-2 mt-lg-0">
                        <li className="nav-item active productDropDownMain">
                            <a className="nav-link admin-nav-link productDropDown dropDown" href="#" onClick={handleShowAllProducts}>Products</a>
                        </li>
                        <li className="nav-item categoryDropDownMain">
                            <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#">Category</a>
                            <div className="categoryDropDownContent dropDownContent">
                                <button className="dropDown-link btn" onClick={handleAddCategory}>Add category</button>
                                <button className="dropDown-link btn" onClick={handleUpdateCategory}>Update category</button>
                                <button className="dropDown-link btn" onClick={handleDeleteCategory}>Delete category</button>
                            </div>
                        </li>
                        <li className="nav-item categoryDropDownMain">
                            <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#">Offers</a>
                            <div className="categoryDropDownContent dropDownContent">
                                <button className="dropDown-link btn" onClick={handleAddOffer}>Add offer</button>
                                <button className="dropDown-link btn" onClick={handleAddOfferUser}>Add offer user</button>
                            </div>
                        </li>
                </ul>)
    }
    
}

export default AdminHome;

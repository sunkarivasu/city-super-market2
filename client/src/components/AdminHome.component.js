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
import AdminShowAllOffers from "./AdminShowAllOffers.component";
import AdminShowAllNormalOffers from "./AdminShowAllNormalOffers.component";
import AdminShowAllOfferUsers from "./AdminShowAllOfferUsers.component";
import AdminShowAllUserRequests from "./AdminShowAllUserRequests.component";
import AdminUpdateOffer from "./AdminUpdateOffer.component";
import AdminUpdateOfferUser from "./AdminUpdateOfferUser.component";
import AdminUpdateNormalOffer from "./AdminUpdateNormalOffer.component";
import AdminUpdateUserRequest from "./AdminUpdateUserRequest.component";
import AdminAddOffer from "./AdminAddOffer.component";
import AdminAddNormalOffer from "./AdminAddNormalOffer.component";
import AdminAddOfferUser from "./AdminAddOfferUser.component";
import axios from "axios";


function AdminHome()
{

    var [showAllProducts,setShowAllProducts] = useState(false);

    var [showAddProduct,setShowAddProduct] = useState(false);
    var [showUpdateProduct,setShowUpdateProduct] = useState(false);
    var [showDeleteProduct,setShowDeleteProduct] = useState(false);
    var [editProductId,setEditProductId] = useState(null);


    var [showAddCategory,setShowAddCategory] = useState(false);
    var [showUpdateCategory,setShowUpdateCategory] = useState(false);
    var [showDeleteCategory,setShowDeleteCategory] = useState(false);

    var [showAdminOptions,setShowAdminoptions] = useState(true);

    var [showAllOffers,setShowAllOffers] = useState(true);

    var [showAddOffer,setShowAddOffer] = useState(false);
    var [showUpdateOffer,setShowUpdateOffer] = useState(false);
    var [editOfferId,setEditOfferId] = useState(null)

    var [showAllNormalOffers,setShowAllNormalOffers] = useState(false)
    var [showAddNormalOffer,setShowAddNormalOffer] = useState(false)
    var [showUpdateNormalOffer,setShowUpdateNormalOffer] = useState(false);
    var [editNormalOfferId,setEditNormalOfferId] = useState(null);

    var [showAllOfferUsers,setShowAllOfferUsers] = useState(false)
    var [showAddOfferUser,setShowAddOfferUser] = useState(false);
    var [showUpdateOfferUser,setShowUpdateOfferUser] = useState(false);
    var [editOfferUserId,setEditOfferUserId] = useState(false);

    var [showAllUserRequests,setShowAllUserRequests] = useState(false);
    var [showUpdateUserRequests,setShowUpdateUserRequests] = useState(false);
    var [editUserRequestId,setEditUserRequestId] = useState(null);

    var navigate = useNavigate();

    useEffect(()=>
    {
        // console.log(showUpdateProduct);
        // var token = localStorage.getItem("token");
        // if(token == null)
        // {
        //     navigate("../AdminLogin");
        // }
        // else
        // {
        //     // axios.get("/checkAdminToken",{headers:{Authorization:token}})
        //     // .then((res)=>{
        //     //     console.log(res.data);
        //     // })
        //     // .catch((err) =>{
        //     //     navigate("../AdminLogin");});

        // return  () => {}
        // }
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
        setShowAllOffers(false);
        setShowUpdateOffer(false);
        setShowUpdateNormalOffer(false);
        setShowAllNormalOffers(false);
        setShowAddNormalOffer(false);
        setShowAddOfferUser(false);
        setShowUpdateOfferUser(false);
        setShowAllOfferUsers(false)
        setShowAllUserRequests(false);
        setShowUpdateUserRequests(false);
    }

    function handleUpdateUserRequest(id)
    {
        resetOptions()
        console.log(id);
        setEditUserRequestId(id)
        setShowUpdateUserRequests(true);
    }

    function handleShowAllUserRequests()
    {
        resetOptions();
        setShowAllUserRequests(true);
    }

    function handleShowAllProducts()
    {
        resetOptions()
        setShowAllProducts(true);
    }

    function handleShowAllOffers()
    {
        resetOptions()
        setShowAllOffers(true);
    }

    function handleShowAllOfferUsers()
    {
        resetOptions()
        setShowAllOfferUsers(true);
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
        resetOptions()
        setShowUpdateCategory(true);
    }

    function handleDeleteCategory()
    {
        resetOptions()
        setShowDeleteCategory(true);
    }

    function handleAddOffer()
    {
        resetOptions();
        setShowAddOffer(true);
    }

    function handleAddNormalOffer()
    {
        resetOptions();
        setShowAddNormalOffer(true);
    }

    function handleAddOfferUser()
    {
        resetOptions();
        setShowAddOfferUser(true);
    }

    function handleUpdateOffer(id)
    {
        console.log(id);
        resetOptions()
        setEditOfferId(id);
        setShowUpdateOffer(true);
    }

    function handleUpdateOfferUser(id)
    {
        console.log(id);
        resetOptions()
        setEditOfferUserId(id);
        setShowUpdateOfferUser(true);
    }
    function handleUpdateNormalOffer(id)
    {
        console.log(id);
        resetOptions()
        setEditNormalOfferId(id);
        setShowUpdateNormalOffer(true);
    }

    function handleShowAllNormalOffers()
    {
        resetOptions();
        setShowAllNormalOffers(true);
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
                        {showAllOffers && <AdminShowAllOffers handleAddOffer={handleAddOffer} handleAddOfferUser={handleAddOfferUser} handleEditOffer={handleUpdateOffer}/>}
                        {showUpdateOffer && <AdminUpdateOffer offerId={editOfferId} handleShowAllOffers={handleShowAllOffers} />}
                        {showAddOffer && <AdminAddOffer handleShowAllOffers={handleShowAllOffers}/>}
                        {showAllNormalOffers && <AdminShowAllNormalOffers handleAddNormalOffer={handleAddNormalOffer} handleEditNormalOffer={handleUpdateNormalOffer}/>}
                        {showAddNormalOffer && <AdminAddNormalOffer handleShowAllNormalOffers={handleShowAllNormalOffers}/>}
                        {showUpdateNormalOffer && <AdminUpdateNormalOffer offerId={editNormalOfferId} handleShowAllNormalOffers={handleShowAllNormalOffers}/>}
                        {showAllOfferUsers && <AdminShowAllOfferUsers handleAddOfferUser={handleAddOfferUser} handleEditOfferUser={handleUpdateOfferUser}/>}
                        {showAddOfferUser && <AdminAddOfferUser handleShowAllOfferUsers={handleShowAllOfferUsers}/>}
                        {showUpdateOfferUser && <AdminUpdateOfferUser offerUserId={editOfferUserId} handleShowAllOfferUsers={handleShowAllOfferUsers}/>}
                        {showAllUserRequests && <AdminShowAllUserRequests handleEditUserRequest={handleUpdateUserRequest}/>}
                        {showUpdateUserRequests && <AdminUpdateUserRequest  userRequestId={editUserRequestId} handleShowAllUserRequests={handleShowAllUserRequests}/>}

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
                            <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#" onClick={handleShowAllOffers}>Offers</a>
                        </li>
                        <li className="nav-item categoryDropDownMain">
                            <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#" onClick={handleShowAllNormalOffers}>Normal Offers</a>
                        </li>
                        <li className="nav-item categoryDropDownMain">
                            <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#" onClick={handleShowAllOfferUsers}>OfferUsers</a>
                        </li>
                        <li className="nav-item categoryDropDownMain">
                            <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#" onClick={handleShowAllUserRequests}>Requests</a>
                        </li>
                </ul>)
    }

}

export default AdminHome;


// import {React} from "react";
// import "../css/style.css";
// import {useNavigate} from "react-router-dom";
// import { useEffect, useState } from "react";
// import AdminAddProduct from "./AdminAddProduct.component";
// import AdminUpdateProduct from "./AdminUpdateProduct.component";
// import AdminDeleteProduct from "./AdminDeleteProduct.component";
// import AdminAddCategory from "./AdminAddCategory.component";
// import AdminUpdateCategory from "./AdminUpdateCategory.component";
// import AdminDeleteCategory from "./AdminDeleteCategory.component";
// import AdminShowAllProducts from "./AdminShowAllProducts.component";
// import AdminShowAllOffers from "./AdminShowAllOffers.component";
// import AdminShowAllNormalOffers from "./AdminShowAllNormalOffers.component";
// import AdminShowAllOfferUsers from "./AdminShowAllOfferUsers.component";
// import AdminUpdateOffer from "./AdminUpdateOffer.component";
// import AdminUpdateOfferUser from "./AdminUpdateOfferUser.component";
// import AdminUpdateNormalOffer from "./AdminUpdateNormalOffer.component";
// import AdminAddOffer from "./AdminAddOffer.component";
// import AdminAddNormalOffer from "./AdminAddNormalOffer.component";
// import AdminAddOfferUser from "./AdminAddOfferUser.component";
// import axios from "axios";


// function AdminHome()
// {

//     var [showAllProducts,setShowAllProducts] = useState(false);

//     var [showAddProduct,setShowAddProduct] = useState(false);
//     var [showUpdateProduct,setShowUpdateProduct] = useState(false);
//     var [showDeleteProduct,setShowDeleteProduct] = useState(false);
//     var [editProductId,setEditProductId] = useState(null);


//     var [showAddCategory,setShowAddCategory] = useState(false);
//     var [showUpdateCategory,setShowUpdateCategory] = useState(false);
//     var [showDeleteCategory,setShowDeleteCategory] = useState(false);

//     var [showAdminOptions,setShowAdminoptions] = useState(true);

//     var [showAllOffers,setShowAllOffers] = useState(true);

//     var [showAddOffer,setShowAddOffer] = useState(false);
//     var [showUpdateOffer,setShowUpdateOffer] = useState(false);
//     var [editOfferId,setEditOfferId] = useState(null)

//     var [showAllNormalOffers,setShowAllNormalOffers] = useState(false)
//     var [showAddNormalOffer,setShowAddNormalOffer] = useState(false)
//     var [showUpdateNormalOffer,setShowUpdateNormalOffer] = useState(false);
//     var [editNormalOfferId,setEditNormalOfferId] = useState(null);

//     var [showAllOfferUsers,setShowAllOfferUsers] = useState(false)
//     var [showAddOfferUser,setShowAddOfferUser] = useState(false);
//     var [showUpdateOfferUser,setShowUpdateOfferUser] = useState(false);
//     var [editOfferUserId,setEditOfferUserId] = useState(false);

//     var navigate = useNavigate();

//     useEffect(()=>
//     {
//         // console.log(showUpdateProduct);
//         var token = localStorage.getItem("token");
//         if(token == null)
//         {
//             navigate("../AdminLogin");
//         }
//         else
//         {
//             axios.get("/checkAdminToken",{headers:{Authorization:token}})
//             .then((res)=>{
//                 console.log(res.data);
//             })
//             .catch((err) =>{
//                 navigate("../AdminLogin");});

//         return  () => {}
//         }
//         // console.log(token)

//     },[showUpdateProduct]);



//     function resetOptions()
//     {
//         setShowAllProducts(false);
//         setShowAddProduct(false);
//         setShowUpdateProduct(false);
//         setShowDeleteProduct(false);
//         setShowAddCategory(false);
//         setShowUpdateCategory(false);
//         setShowDeleteCategory(false);
//         setShowAllProducts(false);
//         setShowAddOffer(false);
//         setShowAllOffers(false);
//         setShowUpdateOffer(false);
//         setShowUpdateNormalOffer(false);
//         setShowAllNormalOffers(false);
//         setShowAddNormalOffer(false);
//         setShowAddOfferUser(false);
//         setShowUpdateOfferUser(false);
//         setShowAllOfferUsers(false)
//     }

//     function handleShowAllProducts()
//     {
//         resetOptions()
//         setShowAllProducts(true);
//     }

//     function handleShowAllOffers()
//     {
//         resetOptions()
//         setShowAllOffers(true);
//     }

//     function handleShowAllOfferUsers()
//     {
//         resetOptions()
//         setShowAllOfferUsers(true);
//     }


//     function handleAddProduct()
//     {
//         resetOptions()
//         setShowAddProduct(true);
//     }

//     function handleUpdateProduct(id)
//     {
//         // console.log(id);
//         resetOptions()
//         setEditProductId(id);
//         setShowUpdateProduct(true);
//     }

//     function handleDeleteProduct()
//     {
//         resetOptions()
//         setShowDeleteProduct(true);
//     }

//     function handleAddCategory()
//     {
//         resetOptions()
//         setShowAddCategory(true);
//     }

//     function handleUpdateCategory()
//     {
//         resetOptions()
//         setShowUpdateCategory(true);
//     }

//     function handleDeleteCategory()
//     {
//         resetOptions()
//         setShowDeleteCategory(true);
//     }

//     function handleAddOffer()
//     {
//         resetOptions();
//         setShowAddOffer(true);
//     }

//     function handleAddNormalOffer()
//     {
//         resetOptions();
//         setShowAddNormalOffer(true);
//     }

//     function handleAddOfferUser()
//     {
//         resetOptions();
//         setShowAddOfferUser(true);
//     }

//     function handleUpdateOffer(id)
//     {
//         console.log(id);
//         resetOptions()
//         setEditOfferId(id);
//         setShowUpdateOffer(true);
//     }

//     function handleUpdateOfferUser(id)
//     {
//         console.log(id);
//         resetOptions()
//         setEditOfferUserId(id);
//         setShowUpdateOfferUser(true);
//     }
//     function handleUpdateNormalOffer(id)
//     {
//         console.log(id);
//         resetOptions()
//         setEditNormalOfferId(id);
//         setShowUpdateNormalOffer(true);
//     }

//     function handleShowAllNormalOffers()
//     {
//         resetOptions();
//         setShowAllNormalOffers(true);
//     }


//     return (
//             <div>
//                 <nav className="navbar admin-navbar navbar-expand-lg">
//                     <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
//                         <a className="navbar-brand" href="#">CSM</a>
//                         {showAdminOptions && <AdminOptions/>}
//                         <img className="profile-image" style={{visibility:"hidden"}}></img>
//                         <button className="admin-logout-btn" onClick={ () => {
//                             localStorage.removeItem("token");
//                             navigate("/adminLogin")
//                         }
//                         }>Logout</button>
//                     </div>
//                 </nav>
//                 <div className="admin-home">
//                     <div className="adminHomeContainer">
//                         {showAllProducts && <AdminShowAllProducts handleAddProduct={handleAddProduct} handleEditProduct={handleUpdateProduct}/>}
//                         {showAddProduct && <AdminAddProduct handleShowAllProducts={handleShowAllProducts}/>}
//                         {showUpdateProduct && <AdminUpdateProduct productId={editProductId} handleShowAllProducts={handleShowAllProducts}/>}
//                         {showDeleteProduct && <AdminDeleteProduct/>}
//                         {showAddCategory && <AdminAddCategory/>}
//                         {showUpdateCategory && <AdminUpdateCategory/>}
//                         {showDeleteCategory && <AdminDeleteCategory/>}
//                         {showAllOffers && <AdminShowAllOffers handleAddOffer={handleAddOffer} handleAddOfferUser={handleAddOfferUser} handleEditOffer={handleUpdateOffer}/>}
//                         {showUpdateOffer && <AdminUpdateOffer offerId={editOfferId} handleShowAllOffers={handleShowAllOffers} />}
//                         {showAddOffer && <AdminAddOffer handleShowAllOffers={handleShowAllOffers}/>}
//                         {showAllNormalOffers && <AdminShowAllNormalOffers handleAddNormalOffer={handleAddNormalOffer} handleEditNormalOffer={handleUpdateNormalOffer}/>}
//                         {showAddNormalOffer && <AdminAddNormalOffer handleShowAllNormalOffers={handleShowAllNormalOffers}/>}
//                         {showUpdateNormalOffer && <AdminUpdateNormalOffer offerId={editNormalOfferId} handleShowAllNormalOffers={handleShowAllNormalOffers}/>}
//                         {showAllOfferUsers && <AdminShowAllOfferUsers handleAddOfferUser={handleAddOfferUser} handleEditOfferUser={handleUpdateOfferUser}/>}
//                         {showAddOfferUser && <AdminAddOfferUser handleShowAllOfferUsers={handleShowAllOfferUsers}/>}
//                         {showUpdateOfferUser && <AdminUpdateOfferUser offerUserId={editOfferUserId} handleShowAllOfferUsers={handleShowAllOfferUsers}/>}

//                     </div>
//                 </div>
//             </div>
//     );

//     function AdminOptions()
//     {
//         return (
//                 <ul className="navbar-nav ms-auto  mt-2 mt-lg-0">
//                         <li className="nav-item active productDropDownMain">
//                             <a className="nav-link admin-nav-link productDropDown dropDown" href="#" onClick={handleShowAllProducts}>Products</a>
//                         </li>
//                         <li className="nav-item categoryDropDownMain">
//                             <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#">Category</a>
//                             <div className="categoryDropDownContent dropDownContent">
//                                 <button className="dropDown-link btn" onClick={handleAddCategory}>Add category</button>
//                                 <button className="dropDown-link btn" onClick={handleUpdateCategory}>Update category</button>
//                                 <button className="dropDown-link btn" onClick={handleDeleteCategory}>Delete category</button>
//                             </div>
//                         </li>
//                         <li className="nav-item categoryDropDownMain">
//                             <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#" onClick={handleShowAllOffers}>Offers</a>
//                         </li>
//                         <li className="nav-item categoryDropDownMain">
//                             <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#" onClick={handleShowAllNormalOffers}>Normal Offers</a>
//                         </li>
//                         <li className="nav-item categoryDropDownMain">
//                             <a className="nav-link admin-nav-link categoryDropDown dropDown" href="#" onClick={handleShowAllOfferUsers}>OfferUsers</a>
//                         </li>
//                 </ul>)
//     }

// }

// export default AdminHome;

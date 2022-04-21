import React, { useState ,useEffect } from "react";
import {useParams,Link,useNavigate} from "react-router-dom";
import axios from "axios";
// import "../css/style.css";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {css} from "glamor";
import Footer from "./footer";
import Header from "./Header.component";
import LoginOrRegister from "./LoginOrRegister.component";
toast.configure()


function ProductDescription(props)
{
    let id = useParams().id;
    var navigate = useNavigate();
    var [productDetails,setProductDetails] = useState(null);
    var [addToCartDisplay,setaddToCartDisplay] = useState("inline");
    var [goToCartDisplay,setGoToCartDisplay] = useState("none");
    var [user,setUser] = useState(localStorage.getItem("user"));
    var [userDetails,setUserDetails] = useState(JSON.parse(user));
    var [orderPlaced,setOrderPlaced] = useState(false);
    var [showDailogBox,setShowDailogBox] = useState(false);
    var [loggedIn,setLoggedIn] = useState(false);

    function handleLoggedIn()
    {
        setLoggedIn(true);
    }

    function handleLoggedOut()
    {
        setLoggedIn(false);
    }

    function handleClickLogin(event)
    {
       setShowDailogBox(true)
    }


    function handleCloseDailog(event)
    {
        console.log("closing")
        setShowDailogBox(false);
    }


    function showToastOnSuccess()
    {
        toast.success("Order Placed successfully",{position:toast.POSITION.BOTTOM_CENTER});
    }

    function toastOnAdd()
    {
        toast.info("Item added to cart",{position:toast.POSITION.BOTTOM_CENTER});
    }

    function updateLocalStorage(id)
    {
        axios.get("/users/getUserDetailsById/"+id)
                .then((res) => {localStorage.setItem("user",JSON.stringify(res.data));setUser(localStorage.getItem("user"));setUserDetails(JSON.parse(user))})
                .catch((err) => console.log("Error while fetching userdetails"+err))
    }


    function handleOnClickAddToCart(event)
    {
        if(addToCartDisplay=="inline")
        {
            axios.post("/users/addToCart/"+event.target.id+"/"+event.target.value)
            .then(() => {console.log("added to cart")
            toastOnAdd()})
            .catch((err) => {console.log("Error occured while adding to cart:"+err)})
            setGoToCartDisplay("inline");
            setaddToCartDisplay("none");
            updateLocalStorage(event.target.id);
        }
        else
        {
            console.log("going to cart");
        }
        
    }

    useEffect(() => {
        // axios.get("/checkUserToken",{
        //     headers:{
        //         Authorization:localStorage.getItem("token")
        //     }
        // })
        // .then(()=> {
            setUser(localStorage.getItem("user"))
            setUserDetails(JSON.parse(user))

            axios.get("/products/idNo/"+id)
                .then((res) => {setProductDetails(res.data)})
                .catch((err) => console.log(err));

            // console.log("/users/inCartOrNot/"+userDetails._id+"/"+id);
            if(userDetails)
                axios.get("/users/inCartOrNot/"+userDetails._id+"/"+id)
                .then((res) => {
                    if(res.data==true)
                    {
                        setGoToCartDisplay("inline");
                        setaddToCartDisplay("none");
                    }
                })
                .catch(err => console.error(err));
        // })
        // .catch((err) => {
        //     navigate("/");
        // });
            setLoggedIn(false)
        return () => {}
    }, [loggedIn]);

    function handleBuyNow(event)
    {
        // var order = 
        // {
        //     productId:productDetails._id,
        //     userId:event.target.id,
        //     quantity:1,
        //     amount:productDetails.price*(100-productDetails.discount)/100
        // }
        localStorage.setItem("orderItems",JSON.stringify([productDetails]))
        navigate("/checkOut");
    }
    
        return (
            <div className="productDescription">
                <Header handleClickLogin={handleClickLogin} loggedIn={loggedIn} handleLoggedOut={handleLoggedOut}/>
                {productDetails?<div className="productDescription-container">
                <div className="product-information row">
                <div className="col-lg-6">
                    <div className="product-image-details">
                        <img className="product-image" src={productDetails.image}></img>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="product-details">
                        <p className="item-brand">{productDetails.brand}</p>
                        <p className="item-priceAfterDiscount">₹ {Math.round((100-productDetails.discount)/100*productDetails.price)}</p>
                        {productDetails.discount>0 && <p className="item-price">₹ {productDetails.price}</p>}
                        {productDetails.discount>0 &&  <p className="item-discount" style={{color:"green"}}>{productDetails.discount} % OFF</p>}
                        <p className="item-description">{productDetails.description}</p>
                    </div>       
                </div>
                <div>
                    <div className="product-btns">
                        <Link className="go-to-cart-btn link" to="/cart">
                            <button className="add-to-cart-btn" style={{display:goToCartDisplay}}>Go To Cart</button>
                        </Link>
                        <button className="add-to-cart-btn" id={userDetails && userDetails._id} value={productDetails._id} onClick={userDetails?handleOnClickAddToCart:handleClickLogin} style={{display:addToCartDisplay}}>Add To Cart</button>
                        <button className="buy-now-btn" id={userDetails && userDetails._id} value={productDetails._id} onClick={userDetails?handleBuyNow:handleClickLogin}>Buy Now</button>
                    </div>
                </div>
            </div>
            </div>:<div className="productDescription-container"><p style={{padding:"50px 10px"}}>Loading...</p></div>}
            <Footer/>
            <LoginOrRegister show={showDailogBox} handleCloseDailog={handleCloseDailog} handleLoggedIn={handleLoggedIn}/>
            </div>
        );
}

export default ProductDescription;

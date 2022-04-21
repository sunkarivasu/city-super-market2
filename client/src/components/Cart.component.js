import React ,{useEffect, useState} from "react";
import axios from "axios";
// import {createItem} from "./List";
import Header from "./Header.component";
import Footer from "./footer";
import {useNavigate} from "react-router-dom";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// import CheckOut from "./CheckOut.component";


function Cart()
{ 
    // var actualTotal = 0;
    var navigate = useNavigate();
    var [user,setUser] = useState(localStorage.getItem("user"));
    var [userDetails,setUserDetails] = useState(JSON.parse(user));
    //var numbers=[1,2,3,4,5,6,7,8,9,10];
    var [cartItems,setCartItems] = useState(null);
    var totalAfterDiscount = 0;
    var [actualTotal,setActualTotal] = useState(0);
    var [totalAfterDiscount,setTotalAfterDiscount] = useState(0);
    // var [calculateBill,setCalculateBill]=useState(0);
    var [itemsInCart,setItemsInCart] = useState(null);
    var [anyProductRemoved,setAnyProductRemoved] = useState(false);
    var [quantityChanged,setQuantityChanged] = useState(false);
    // var [CheckOut,setCheckOut] = useState(true);
    

    useEffect(()=>
    {
        axios.get("/checkUserToken",{
            headers:{Authorization:localStorage.getItem("token")}
        })
            .then(()=>
            {
                var user = localStorage.getItem("user");
                axios.get("/users/cartItems/"+JSON.parse(user)._id)
                    .then((res) => {
                        setCartItems(res.data.reverse());
                        var actual = 0
                        var totalafterdiscount = 0
                        if(res.data)
                        res.data.map((item)=>
                            {
                                actual+=item.price*item.orderQuantity;
                                totalafterdiscount+=(item.price*(100-item.discount)/100*item.orderQuantity);
                        });
                        setActualTotal(actual)
                        setTotalAfterDiscount(totalafterdiscount)
                        setAnyProductRemoved(false);
                        setQuantityChanged(false)})
                    .catch((err) =>{console.log("Error"+err)});
            })
            .catch((err)=>{navigate("../");})      
    },[anyProductRemoved,quantityChanged]);

    function updateLocalStorage(id)
    {
        axios.get("/users/getUserDetailsById/"+id)
                .then((res) => {localStorage.setItem("user",JSON.stringify(res.data));setUser(localStorage.getItem("user"));setUserDetails(JSON.parse(user))})
                .catch((err) => console.log("Error while fetching userdetails"+err))
    }

    function handleDeleteFromCart(event)
    {
        console.log(event.target.value)
        //console.log("http://locahost:9000/users/removeFromCart/"+userDetails._id+"/"+event.target.value);
        axios.post("/users/removeFromCart/"+userDetails._id+"/"+event.target.value)
        .then(()=>{
            updateLocalStorage(userDetails._id)
            console.log("Item removed from cart");
        })
        .catch((err) =>
        {
            console.log("Error occured while removing item from cart"+err);
        })
        setAnyProductRemoved(true);
    }

    function changeTotalCost()
    {
        var actual = 0
        var totalafterdiscount = 0
        if(cartItems)
        cartItems.map((item)=>
            {
                actual+=item.price*item.orderQuantity;
                totalafterdiscount+=(item.price*(100-item.discount)/100*item.orderQuantity);
        });
        setActualTotal(actual)
        setTotalAfterDiscount(totalafterdiscount)
    }

    function handleIncreaseQuantity(event)
    {
       axios.post("/users/increaseQuantity",{userId:userDetails._id,productId:event.target.id})
       .then(()=>{
                setQuantityChanged(true)
                console.log("Quantity increased")})
       .catch((err) =>{console.log("Error occured while increasing the quantity"+err)})
    }

    function handleDecreaseQuantity(event)
    {
        axios.post("/users/decreaseQuantity",{userId:userDetails._id,productId:event.target.id})
        .then(()=> {
            setQuantityChanged(true);
            console.log("Quantity decreased")})
        .catch((err) => console.log("Error occured while decreasing the quantity"+err))
    }

    function handlePlaceOrder(event)
    {
        localStorage.setItem("orderItems",JSON.stringify(cartItems))
        navigate("/checkOut")
    }

    

    function createCartItem(props)
    {
        console.log(props);
        return <div>
        <div className="itemInCart"><div className=" row">
            <div className="col-md-4 itemInCart-img"><img src={props.image} style={{width:"120px",height:"120px"}}/></div>
            <div className="col-md-4">
                <div className="itemInCart-detials">
                    <p className="item-brand">{props.brand}</p>
                    <div className="price">
                        <p className="item-priceAfterDiscount col-6">₹ {Math.round(props.price*(100-props.discount)/100)}</p>
                        {props.discount>0 && <p className="item-price col-6">₹ {props.price}</p>}
                    </div>
                    <p className="item-description">{props.description}</p>
                    {/* <button className="btn deleteFromCart-btn" style={{width:"100%"}}>Delete from cart</button> */}
                </div>
            </div>
            <div className="col-md-4">
            <div className="flex-container">
                <div class="each">
                    <div style={{display:"block"}}>Each</div>
                    <div style={{display:"block"}}>₹ {Math.round(props.price*(100-props.discount)/100)}</div>
                </div>
                <div class="quantityInCart">
                    <div style={{display:"block"}}>Quantity</div>
                    <div style={{display:"block"}}>
                        <p style={{textAlign:"center"}}>{props.orderQuantity}</p>
                    </div>
                </div>
                <div class="totalInCart">
                    <div style={{display:"block"}}>Total</div>
                    <div style={{display:"block"}}>₹ {Math.round(props.price*(100-props.discount)/100)*props.orderQuantity}</div>
                </div>
            </div>
            </div>
        </div>
        <div style={{display:"flex",marginTop:"10px",justifyContent:"space-between"}}>
        <div className="quantity-change" style={{width:"120px",paddingLeft:"5px"}}>
            <button className="minuss-btn" id={props._id} onClick={handleDecreaseQuantity} style={{border:"1px solid black",width:"30px",height:"30px",borderRadius:"50%",marginRight:"5px"}} disabled={props.orderQuantity>=2?false:true}  >-</button> 
            <input type="text" style={{width:"40px",height:"30px",padding:"10px 0px",textAlign:"center"}} id={props._id} value={props.orderQuantity}/> 
            <button className="pluss-btn" id={props._id} onClick={handleIncreaseQuantity} style={{border:"1px solid black",borderRadius:"50%",width:"30px",height:"30px",marginLeft:"5px"}}>+</button>  
        </div>
        <div className="itemInCart-delete-section"><button className="itemInCart-delete-btn" onClick={handleDeleteFromCart} value={props._id}>Remove</button></div>
        </div>
        </div>
        </div>
    }
    
        return <div className="cart">
            <Header/>
            <div className="cart-container">
                {cartItems?<div>
                    {cartItems.length>0?<div className="row">
                    <div className="row items-section col-md-8">
                        {cartItems.map(createCartItem)}
                    </div>
                    <div className="xyz col-md-3">
                        <div className="price-section-item price-section-cost row">
                            <p className="col-6">Cost</p>
                            <p className="col-6" style={{textAlign:"right"}}>{Math.round(actualTotal)}</p>
                        </div>
                        <div className="price-section-item price-section-discount row">
                            <p className="col-6">Discount</p>
                            <p className="col-6" style={{textAlign:"right"}}>{Math.round(actualTotal-totalAfterDiscount)}</p>
                        </div>
                        <div className="price-section-item price-section-total row">
                            <p className="col-6">Total</p>
                            <p className="col-6" style={{textAlign:"right"}}>{Math.round(totalAfterDiscount)}</p>
                        </div>
                        <div className="price-section-place-order" style={{textAlign:"right"}}>
                            <button className="price-section-place-order-btn btn btn-primary" onClick={handlePlaceOrder}>PLACE ORDER</button>
                        </div> 
                    </div></div>:<div className="noItemsMsg"><h1 className="emptyMsg">Empty</h1><p>No Items added to your cart</p></div>}
                </div>:<div style={{padding:"10px 50px"}}>Loading...</div>}
            </div>
            <Footer/>
        </div>   
}

export default Cart;


{/* <div className="price-section">
                            <div className="price-section-item price-section-cost row">
                                <p className="col-6">Cost</p>
                                <p className="col-6">{Math.round(actualTotal)}</p>
                            </div>
                            <div className="price-section-item price-section-discount row">
                                <p className="col-6">Discount</p>
                                <p className="col-6">{Math.round(actualTotal-totalAfterDiscount)}</p>
                            </div>
                            <div className="price-section-item price-section-total row">
                                <p className="col-6">Total</p>
                                <p className="col-6">{Math.round(totalAfterDiscount)}</p>
                            </div>
                            <div className="price-section-place-order">
                                <button className="price-section-place-order-btn btn btn-primary" onClick={handlePlaceOrder}>PLACE ORDER</button>
                            </div>
                        </div> */}
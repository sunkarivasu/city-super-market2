import axios from "axios";
import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import Header from "./Header.component";

function Orders()
{
    var navigate = useNavigate();
    var [user,setUser] = useState(localStorage.getItem("user"));
    var [userDetails,setUserDetails] = useState(JSON.parse(user));
    var [orderList,setOrderList] = useState(null);
    
    useEffect(()=>
    {
        axios.get("/checkUserToken",{
            headers:{
                Authorization:localStorage.getItem("token")
            }
        })
        .then(() => {
            axios.get("/orders/getOrdersByUserId/"+userDetails._id)
            .then((res)=>{
                setOrderList(res.data.reverse());})
            .catch((err)=>{console.log("Error occured while fetching the order list")});
        })
        .catch((err) => {
            navigate("/");
        });
    },[])
    
    function createOrderItem(props)
    {
        return <div>
        <div className="itemInCart itemInOrderList"><div className=" row">
            <div className="col-md-3 itemInCart-img"><img style={{width:"100px",height:"100px"}} src={props.productDetails[0].image}/></div>
            <div className="col-md-3">
                <div className="itemInCart-detials">
                    <p className="item-brand">{props.productDetails[0].brand}</p>
                    {/* <div className="price">
                        <p className="item-priceAfterDiscount col-6">₹ {Math.round(props.productDetails[0].price*(100-props.productDetails[0].discount)/100)}</p>
                        {props.productDetails[0].discount>0 && <p className="item-price col-6">₹ {props.productDetails[0].price}</p>}
                    </div> */}
                    <p className="item-description">{props.productDetails[0].description}</p>
                    {/* <button className="btn deleteFromCart-btn" style={{width:"100%"}}>Delete from cart</button> */}
                </div>
            </div>
            <div className="col-md-3">
                <div class="totalInCart">
                    {/* <div style={{display:"block"}}>Total</div> */}
                    <div style={{display:"block"}}>₹ {Math.round(props.productDetails[0].price*(100-props.productDetails[0].discount)/100)*props.quantity}</div>
                </div>
            </div>
            <div className="col-md-3">
                <div class="orderStatus">
                    {/* <div style={{display:"block"}}>Total</div> */}
                    <button className="" style={{width:"10px",height:"10px",borderRadius:"50%",backgroundColor:"green",marginBottom:"5px"}} disabled></button>
                    <div className="" style={{display:"inline",padding:"30px 10px 0px 10px"}} >Yet to be Delivered</div>
                </div>
            </div>
        </div>
        </div>
        </div>
    }



    return <div className="orders">
        <Header/>
        <div className="orders-container">
            {orderList?<div>{orderList.length>0?<div>
                {orderList.map(createOrderItem)}
            </div>:<div className="noOrdersMsg"><h1 className="EmptyMsg">Empty</h1><p>No Orders placed yet</p></div>}</div>:<div className="loading">Loading...</div>}
        </div>
        <Footer/>
    </div>
}

export default Orders;
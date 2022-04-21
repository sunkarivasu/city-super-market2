// import { useState } from 'react';
// import { FaSearch } from 'react-icons/fa';
import {FaShoppingCart,FaUserTie} from "react-icons/fa"
// import Login from "./Login.component";
import {Link, useNavigate} from "react-router-dom";
import React,{useEffect, useState} from "react";
import "../css/style.css"
// import {BrowserRouter as Router,Switch,Route} from "react-router-dom";

function Header(props)
{
    var navigate = useNavigate(); 
    var user = localStorage.getItem("user");
    var userDetails = JSON.parse(user);
    var [loggedIn,setLoggedIn] = useState(user?true:false);

    useEffect(()=>
    {
        // console.log("running");
        setLoggedIn(user?true:false);
    });

    return (
        <nav className="navbar navbar-expand-lg  navbar-dark ">
        <Link className="navbar-brand" to="/">CSM </Link>
        <button className="navbar-toggler navbar-toggler-iconTest" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon navbar-toggler-iconTest"></span>
        </button>
      
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            {!loggedIn?
            <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
            
                <li>
                    <button className="navbar-login-btn nav-link" onClick={props.handleClickLogin} style={{color:"#172337"}}>Login</button>
                </li>
            </ul>:
            <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                <li className='nav-item cart-section'>
                    <button className="nav-link cart-btn" onClick={()=>{navigate("../cart")}}><i className="cart-icon"><FaShoppingCart/>{<p className="no-of-products-in-cart" style={{display:userDetails.cartItems.length==0?"none":"absolute"}}>{userDetails.cartItems.length}</p>}</i><p className='cart-text'>Cart</p>
                    </button> 
                </li>
                <li className="show-option nav-item profileName-main">
                    <button className="nav-link profileName btn" >{userDetails.name}</button>
                    <div className="profile-options-main">
                        <div className="profile-options">
                            <button className="profile-option btn" onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");setLoggedIn(false);navigate("/");}}>Logout</button>
                            <button className="profile-option btn" onClick={()=> navigate("/order")}>Orders</button>
                        </div>
                    </div>
                </li>
                <li className="hide-option nav-link">
                    <button className="hide-option-btn " onClick={()=> navigate("/order")}>orders</button>
                </li>
                <li className="hide-option nav-link">
                    <button className=" hide-option-btn" onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");setLoggedIn(false);navigate("/");}}>logout</button>
                </li>
          </ul>}
        </div>
      </nav>);

}

export default Header;


// <nav className="navbar navbar-expand-lg navbar-dark navbar-fixed-top">
//                     <Link className="navbar-brand" to="/">CSM </Link>
                    
//                     <div id="navbarSupportedContent" className="collapse navbar-collapse">
//                         <ul className="navbar-nav ms-auto">
//                             {loggedIn?
//                                 <div className="flex-container">
//                                 <li className='nav-item cart-section'>
//                                 <button className="nav-link cart-btn" onClick={()=>{navigate("../cart")}}><i className="cart-icon"><FaShoppingCart/></i><p className='cart-text'>Cart</p>
//                                 </button>  
//                                 </li>
//                                 <div className="profileName-main">
//                                     <button className="profileName btn">{userDetails.name}</button>
//                                     <div className="profile-options-main">
//                                         <div className="profile-options">
//                                             <button className="profile-option btn" onClick={()=>{
//                                                 localStorage.removeItem("token")
//                                                 localStorage.removeItem("user")
//                                                 setLoggedIn(false)
//                                                 navigate("/");
//                                             }}>Logout</button>
//                                             <button className="profile-option btn" onClick={()=>
//                                             {
//                                                 navigate("../order")
//                                             }}>Orders</button>
//                                         </div>
//                                     </div></div>
//                                     </div>:<li className="nav-item navbar-item-login active"><button className="navbar-login-btn nav-link" onClick={props.handleClickLogin}>Login</button></li>}
//                         </ul>
//                     </div>  
//                     <button className="navbar-toggler" type="button" date-ds-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>  
//             </nav>
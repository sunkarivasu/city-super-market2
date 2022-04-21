import React,{useState,useEffect} from "react";
import "../css/style.css";
import {useSelector,useDispatch} from 'react-redux';

import {actions} from "../store/index"; 


function AdminTest()
{
    // const counter = useSelector((state) => state.counter)
    // var dispatch = useDispatch()
    // const handleIncrement = () => dispatch(actions.increment())
    // const handleDecrement = () => dispatch(actions.decrement())
    
    return (<div className="birthday-carousel row" style={{padding:"10px",backgroundColor:"orange"}}>
        <div className="col-2"></div>
        <div className="col-4">
            <img src="gs_photo.JPG" alt="mayya-img" style={{width:"220px",height:"220px",borderRadius:"50%",margin:"50px"}}/>
        </div>
        <div className="col-6">
            <p style={{marginTop:"90px",color:"white",fontWeight:"900",fontFamily:"italic",fontSize:"50px"}}>Happy Birthday Mayya</p>
            <div style={{textAlign:"center"}}>
                <p style={{marginTop:"10px",color:"green",fontWeight:"700",fontFamily:"italic",fontSize:"25px"}}>May all your dreams come true</p>
            </div>
        </div>
    </div>)
}

export default AdminTest;

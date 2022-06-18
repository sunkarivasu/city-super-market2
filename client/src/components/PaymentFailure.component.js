import React, { useEffect, useState} from "react";

function PaymentFailurePage()
{
    return <div className="paymentSuccess" style={{textAlign:"center",padding:"40px 0",background:"#EBF0F5"}}>
    <div className="paymentStatus">
        <div class="card" style={{background:"white",padding:"60px",borderRadius:"4px",boxShadow: "0 2px 3px #C8D0D8",display: "inline-block",margin:"0 auto"}}>
            <div style={{borderRadius:"200px",height:"200px", width:"200px",background: "#F8FAF5", margin:"0 auto"}}>
                <i className="checkmark" style={{color: "#9ABC66",fontSize:"100px",lineHeight:"200px",marginLeft:"-15px"}}>
                ❌</i>
            </div>
            <h1 style={{color:"red",fontFamily: "'Nunito Sans', 'Helvetica Neue', 'sans-serif'",fontWeight:"900",fontSize:"40px",marginBottom:"10px"}}>Failure</h1> 
            <p style={{color:"#404F5E",fontFamily: "'Nunito Sans', 'Helvetica Neue', sans-serif",fontSize:"20px",margin: "0"}}>Something went wrong, Your payment Failed!</p>
        </div>
    </div>
</div>
}

export default PaymentFailurePage
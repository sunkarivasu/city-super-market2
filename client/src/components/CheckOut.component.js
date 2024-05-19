import React, { useEffect, useState} from "react";
import { useParams,useNavigate } from "react-router-dom";
import Footer from "./footer";
import Header from "./Header.component";
import axios from "axios";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function CheckOutPage()
{
    var [user,setUser] = useState(localStorage.getItem("user"));
    var navigate = useNavigate();
    var [orderItems,setOrderItems] = useState(localStorage.getItem("orderItems"));
    var [orderItemDetails,setOrderItemDetails] = useState(JSON.parse(orderItems))
    var initialState = {
        firstName:"",
        lastName:"",
        mobile:"",
        mandel:"None",
        village:"None",
        doorNumber:"",
        streetName:"",
        pinCode:"",
        firstNameErr:"init",
        lastNameErr:"init",
        mobileErr:"init",
        mandelErr:"init",
        villageErr:"init",
        doorNumberErr:"init",
        streetNameErr:"init",
        pinCodeErr:"init"
    }

    var availableAreas = {'None':['None'],'Rajam':['Rajam','Dolapeta','Kancharam','Vanjarampeta'],'Santhakaviti':['Santhakaviti','Ponugutivalasa','Bodduru','Billani'],'Palakonda':['Palakonda','Annavaram']}
    var [form,setForm] = useState(initialState);

    useEffect(()=>
    {
        axios.get("/checkUserToken",{
            headers:{Authorization:localStorage.getItem("token")}})
            .then(()=>{
                if(!localStorage.getItem("orderItems"))
                    navigate("/")
            })
            .catch((err) => {navigate("/")});

        return () => {
            localStorage.removeItem("orderItems");
        }
    },[]);


    const handleForm = (event) => {
        var id = event.target.id
        if(id=="mobile")
        {
            var l = event.target.value.length
            var lc = event.target.value.charAt(l-1)
            if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
                if(event.target.value.length>10)
                    setForm({...form,[id]:event.target.value.slice(0,l-1)})
                else
                setForm({...form,[id]:event.target.value})
            else
                setForm({...form,[id]:event.target.value.slice(0,l-1)})

        }
        else if(id=="pinCode")
        {
            var l = event.target.value.length
            var lc = event.target.value.charAt(l-1)
            if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
                if(event.target.value.length>6)
                    setForm({...form,[id]:event.target.value.slice(0,l-1)})
                else
                    setForm({...form,[id]:event.target.value})
            else
                setForm({...form,[id]:event.target.value.slice(0,l-1)})
        }
        else
            setForm({...form,[id]:event.target.value})
        }



    const validateForm = () =>
    {
        var firstNameErr,lastNameErr,mobileErr,pinCodeErr,streetNameErr,doorNumberErr,mandelErr,villageErr
        //firstName Error
        if(form.firstName.length==0)
            firstNameErr="Enter FirstName"
        else if(!form.firstName.match(/^[a-zA-Z ]{2,}$/))
            firstNameErr="Invalid FirstName"
        else
            firstNameErr=""

        //lastName Error
        if(form.lastName.length==0)
            lastNameErr="Enter LastName"
        else if(!form.lastName.match(/^[a-zA-Z ]{2,}$/))
            lastNameErr="Invalid LastName"
        else
            lastNameErr=""

        //streetName Error
        if(form.streetName.length==0)
            streetNameErr="Enter streetName"
        else if(form.streetName.match(/^[a-zA-Z ]{2,}$/))
            streetNameErr=""
        else
            streetNameErr="Invalid streetName"

        //mobile Error
        if(form.mobile.length==0)
            mobileErr="Enter Mobile Number"
        else if (form.mobile.length!=10)
            mobileErr="Invalid Mobile Number";
        else
            mobileErr=""

        //pincode Error
        if(form.pinCode.length==0)
            pinCodeErr="Enter Pincode"
        else if (form.pinCode.length!=6)
            pinCodeErr="Invalid PinCode";
        else
            pinCodeErr=""

        //mandel Error
        if(form.mandel=="None")
            mandelErr="Select mandel"
        else
            mandelErr=""

        //village Error
        if(form.village=="None")
            villageErr="Select Village/Town"
        else
            villageErr=""

        //doorNumber Error
        if(form.doorNumber.length==0)
            doorNumberErr="Enter DoorNo"
        else
            doorNumberErr=""

        setForm({...form,firstNameErr:firstNameErr,lastNameErr:lastNameErr,mobileErr:mobileErr,mandelErr:mandelErr,villageErr:villageErr,pinCodeErr:pinCodeErr,doorNumberErr:doorNumberErr,streetNameErr:streetNameErr})

        if(firstNameErr=="" && lastNameErr=="" && mobileErr=="" && mandelErr=="" && villageErr=="" && doorNumberErr=="" && streetNameErr=="" && pinCodeErr=="")
            return true
        else
            return false
    }

    const showToastOnSuccess = () => toast.success("Order Placed successfully",{position:toast.POSITION.BOTTOM_CENTER});

    const handleSubmitForm = (event) =>
    {
        console.log(form);
        event.preventDefault();
        if(validateForm())
        {
            var deliveryAddress = {
                firstName:form.firstName,
                lastName:form.lastName,
                mobile:form.mobile,
                amount:"1",
                email:"sunkarivasu1@gmail.com",
                mandel:form.mandel,
                village:form.village,
                doorNumber:form.doorNumber,
                streetName:form.streetName,
                // landMark:String,
                pinCode:form.pinCode,
            }


        axios.post("/paynow",deliveryAddress)
        .then((res) =>
        {
            // console.log("payment initiated");
            // console.log(JSON.stringify(res.data));
            // localStorage.setItem("paymentDetails",JSON.stringify(res.data));
            navigate("/order")
        })
        .catch((err) =>
        {
           console.log("payment failed");
        })

            //placing order after payment

            orderItemDetails.map((productDetails)=>
            {
                var actualQuantity
                if(productDetails.orderQuantity == undefined)
                {
                    actualQuantity = 1
                }
                else
                {
                    actualQuantity = productDetails.orderQuantity
                }

                var order =
                {
                    productId:productDetails._id,
                    userId:JSON.parse(user)._id,
                    quantity:actualQuantity,
                    amount:productDetails.price*(100-productDetails.discount)/100*actualQuantity,
                    deliveryAddress:deliveryAddress
                }
                console.log(order);
                axios.post("/orders/add",order)
                .then(()=>
                    {
                        console.log("order placed");
                    })
                .catch((err)=>{console.log("Error:"+err)})
            })

            // end for placing order after payment

                //setOrderPlaced(true)
            // showToastOnSuccess()
            // setTimeout(() => navigate("/order"),2000);
        }
    }



    return (
        <div>
            <Header/>
            <div className="checkout">
                <form className="checkout-form">
                    <p style={{textAlign:"center",fontSize:"20px",fontWeight:"500"}}>Shipping Address</p>
                    <div style={{display:"flex",justifyContent:"space-around"}}>
                        <div className="" style={{width:"50%",marginRight:"5px"}}>
                            <input className="firstName checkout-form-control" type="text" placeholder="First Name" id="firstName" onChange={handleForm} value={form.firstName}/>
                            {form.firstNameErr!="init" && form.firstNameErr.length>0 && <p className="err">{form.firstNameErr}</p>}
                        </div>
                        <div  className="" style={{width:"50%",marginLeft:"5px"}}>
                            <input className="lastName checkout-form-control" type="text" placeholder="Last Name" id="lastName" onChange={handleForm} value={form.lastName}/>
                            {form.lastNameErr!="init" && form.lastNameErr.length>0 && <p className="err">{form.lastNameErr}</p>}
                        </div>
                    </div>
                    <input className="mobile checkout-form-control" type="text" placeholder="Mobile" id="mobile" onChange={handleForm} value={form.mobile}/>
                    {form.mobileErr!="init" && form.mobileErr.length>0 && <p className="err">{form.mobileErr}</p>}
                    <label>Mandel</label>
                    <select className="mandel checkout-form-control" id="mandel" placeholder="Mandel" onChange={handleForm} value={form.mandel}>
                        {Object.keys(availableAreas).map( (Mandel) => {
                            return <option value={Mandel}>{Mandel}</option>
                        })}
                    </select>
                    {form.mandelErr!="init" && form.mandelErr.length>0 && <p className="err">{form.mandelErr}</p>}
                    <label>Village/Town</label>
                    <select className="village checkout-form-control" id="village" onChange={handleForm} value={form.village}>
                        <option value={"None"}>None</option>
                        {availableAreas[form.mandel].map( (Mandel) => {
                            return <option value={Mandel}>{Mandel}</option>
                        })}
                    </select>
                    {form.villageErr!="init" && form.villageErr.length>0 && <p className="err">{form.villageErr}</p>}
                    <div style={{display:"flex",justifyContent:"space-around",flex:"2 1 auto"}}>
                        <div style={{width:"30%",marginRight:"5px"}}>
                            <input type="text" className="doorNumber checkout-form-control"  id="doorNumber" placeholder="Door No" value={form.doorNumber} onChange={handleForm}/>
                            {form.doorNumberErr!="init" && form.doorNumberErr.length>0 && <p className="err">{form.doorNumberErr}</p>}
                        </div>
                        <div style={{width:"70%",marginLeft:"5px"}}>
                            <input className="streetName checkout-form-control" type="text"  placeholder="Street Name" id="streetName" onChange={handleForm}/>
                            {form.streetNameErr!="init" && form.streetNameErr.length>0 && <p className="err">{form.streetNameErr}</p>}
                        </div>
                    </div>
                    <input type="text" className="pinCode checkout-form-control" placeholder="Pin Code" id="pinCode" onChange={handleForm} value={form.pinCode}/>
                    {form.pinCodeErr!="init" && form.pinCodeErr.length>0 && <p className="err">{form.pinCodeErr}</p>}
                    <button className="confirm-btn" onClick={handleSubmitForm}>Confirm</button>
                </form>
            </div>
            <Footer/>
        </div>)
}

export default CheckOutPage;


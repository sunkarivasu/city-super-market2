import axios from "axios";
import React, { useEffect } from "react";
import { useState} from "react";
import "../css/style.css";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import {storage} from "../firebase";

function AdminUpdateOfferUser(props)
{

  var intialState = 
  {
    name:"",
    phoneNumber:"",
    startDate:"",
    endDate:"",
    noOfDays:"",
    nameErr:"",
    phoneNumberErr:"",
  }

  var [form,setForm] = useState(intialState)
  var [canBeSubmitted,setCanBeSubmitted] = useState(false);
  var [checkForm,setCheckForm] = useState(false)
  var [updateSuccess,setUpdateSuccess] = useState(false);
  var [updateFailure,setUpdateFailure] = useState(false);
  var [update,setUpdate] = useState(false);

  if(updateSuccess)
    {
      toast.success("OfferUser updated successfully",{position:toast.POSITION.BOTTOM_CENTER});
    }

    if(checkForm)
    {
      validate()
      setCheckForm(false)
    }


    function validate()
    {
        console.log("validating...",form);
      if (form.nameErr=="" && form.phoneNumberErr=="")
      {
          console.log("can be submitted");
          setCanBeSubmitted(true);
      }
      else
      {
          setCanBeSubmitted(false);
      }
    }

    function updateOfferUser()
    {
        console.log("updating offerUser..");
        axios.put("/offerUsers/updateOfferUserDetails",{...form,_id:props.offerUserId})
                .then(() => {console.log("Offer updated by admin")
                    setUpdateSuccess(true)
                    setUpdateFailure(false)
                    props.handleShowAllOfferUsers()
                  })
                .catch((err) => {console.log("Error:"+err)
                setUpdateSuccess(false)
                setUpdateFailure(true)});
    }
    
  useEffect(() => {
    axios.get("/offerUsers/idNo/"+props.offerUserId)
      .then((res) => {
        setForm({...intialState,...res.data})
    console.log(res.data);
    })
      .catch((err) => {console.log("Error occured while fetching offerUser details");})
    return () => {}
  },[]);

  function validateForm(field,value)
  {
    switch(field)
    {
      case 'name':
        if(value.length<3)
          setForm({...form,nameErr:"Winner Name should contain atleast 3 characters",name:value})
        else if (!value.match(/^[a-zA-Z ]{3,}$/gm))
        {
          setForm({...form,nameErr:"Product Name should only contain characters",name:value})
        }
        else
          setForm({...form,nameErr:"",name:value})
        break
    case 'phoneNumber':
        if(value.length != 10)
            setForm({...form,phoneNumberErr:"PhoneNumber should contain exactly 10 digits",phoneNumber:value})
        else
            setForm({...form,phoneNumber:value,phoneNumberErr:""})
    }
}

  function handleChangeForm(event)
  {
    console.log(form);
    if(event.target.id=="phoneNumber" || event.target.id=="noOfDays")
    {
      var l = event.target.value.length
      var lc = event.target.value.charAt(l-1)
      if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
      {
        setForm({...form,[event.target.id]:event.target.value});
        validateForm(event.target.id,event.target.value)
      }
      else
      {
        setForm({...form,[event.target.id]:event.target.value.slice(0,l-1)})
        validateForm(event.target.id,event.target.value.slice(0,l-1))
      } 
    }
    else
    {
      setForm({...form,[event.target.id]:event.target.value});
      validateForm(event.target.id,event.target.value)
    }
    setCheckForm(true)
  }


    return(<div className="adminUpdateOfferUser">
        <form className="admin-form adminUpdateOfferUser-form" onSubmit={(e) =>{e.preventDefault();}}>
          <p className="adminForm-title">Update OfferUser</p>
          <div className="form-group">
            <label for="productName">Name</label>
            <input type="text" className="form-control name" id="name" onChange={handleChangeForm} value={form.name} placeholder=""/>
            { form.nameErr.length>0 && form.nameErr!="init" && <p className="adminErr err">{form.nameErr}</p>}
          </div>
          <div className="form-group" >
            <label for="phoneNumber">Phone Number</label>
            <input type="text" className="form-control "  onChange={handleChangeForm} id="phoneNumber" value={form.phoneNumber}/>
            { form.phoneNumberErr.length>0 && form.phoneNumberErr!="init" && <p className="adminErr err">{form.phoneNumberErr}</p>}
          </div>
          <div className="form-group" >
            <label for="startDate">Start Date</label>
            <input type="text" className="form-control startDate"  onChange={handleChangeForm} id="startDate" value={form.startDate.slice(0,10)} disabled/>
          </div>
          <div className="form-group" >
            <label for="endDate">End Date</label>
            <input type="text" className="form-control startDate"  onChange={handleChangeForm} id="endDate" value={form.endDate.slice(0,10)} disabled/>
          </div>
          <div className="form-group" >
            <label for="endDate">Add Days</label>
            <input type="text" className="form-control add-days"  onChange={handleChangeForm} id="noOfDays" value={form.noOfDays} />
          </div>
          { canBeSubmitted?<button type="button" className="btn btn-primary"  onClick={updateOfferUser}>Update</button>:<button type="button" className="btn btn-primary" disabled>Update</button>}
          {updateSuccess && <p className="successMsg" >OfferUser Updated Successfully</p>}
          {updateFailure && <p className="failureMsg">Please Try Again</p>}   
      </form>
    </div>
    )
};

export default AdminUpdateOfferUser;


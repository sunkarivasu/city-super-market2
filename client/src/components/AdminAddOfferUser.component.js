import React,{useEffect,useState} from "react";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";


function AdminAddOfferUser(props)
{
    var initialState ={
        name:"",
        phoneNumber:"",
        noOfDays:"",
        nameErr:"init",
        phoneNumberErr:"init"
    }

    var [form,setForm] = useState(initialState);
    var [canBeSubmitted,setCanBeSubmitted] = useState(false);
    var [checkForm,setCheckForm] = useState(false);
    var [add,setAdd] = useState(false);

    useEffect(() => {

        function validate()
        {
            if (form.nameErr==="" && form.phoneNumberErr==="")
                setCanBeSubmitted(true);
            else
                setCanBeSubmitted(false);
        }



        if(checkForm)
        {
            validate()
            setCheckForm(false)
        }

    },[checkForm])


    function reset()
    {
        setForm(initialState);
        // setAddSuccess(false);
        // setAddFailure(false);
        setCanBeSubmitted(false);
        setAdd(false);
        setCheckForm(false);
    }

    function addOfferUSer()
    {
        axios.post("/offerUsers/add",{...form})
        .then((res) => {console.log("Offer added by admin")
                    // setAddSuccess(true)
                    // setAddFailure(false)
                    if(res.data.status)
                    {
                        toast.success("OfferUser added successfully",{position:toast.POSITION.BOTTOM_CENTER});
                        props.handleShowAllOfferUsers()
                        reset();
                    }
                    else
                    {
                        toast.warning("Phone Number Already Exists",{position:toast.POSITION.BOTTOM_CENTER});
                    }
                    })
        .catch((err) => {console.log("Error:"+err)
                        toast.error("Some Error occured. Please try again",{position:toast.POSITION.BOTTOM_CENTER});
                    });
    }


    function handleChangeForm(event)
    {
        if(event.target.id=="phoneNumber")
        {
            var l = event.target.value.length
            var lc = event.target.value.charAt(l-1)
            if((lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9') && l<=10)
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

    function validateForm(field,value)
    {
        switch(field)
        {
        case 'name':
            if(value.length<3)
            setForm({...form,nameErr:"Name should contain atleast 3 characters",name:value})
            else if (!value.match(/^[a-zA-Z][a-zA-Z ]{2,}$/gm))
            {
            setForm({...form,nameErr:"Product Name should only contain characters",name:value})
            }
            else
            setForm({...form,nameErr:"",name:value})
            break
        case 'phoneNumber':
            if(value.length==0)
                setForm({...form,phoneNumberErr:"Enter Phone Number",phoneNumber:value})
            else if (value.length != 10)
                setForm({...form,phoneNumberErr:"Invalid Phone Number",phoneNumber:value})
            else
                setForm({...form,phoneNumberErr:"",phoneNumber:value})
            break
        }
    }



    return (
    <div className="adminAddOfferUser">
        <form className="admin-form adminAddOfferUser-form">
            <p className="adminForm-title">Add Offer User</p>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control productName" id="name" onChange={handleChangeForm} value={form.name} placeholder=""/>
                { form.nameErr.length>0 && form.nameErr!="init" && <p className="adminErr err">{form.nameErr}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input type="text" className="form-control price"  onChange={handleChangeForm} id="phoneNumber" value={form.phoneNumber}/>
                { form.phoneNumberErr.length>0 && form.phoneNumberErr!="init" && <p className="adminErr err">{form.phoneNumberErr}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="noOfDays">Number Of Days</label>
                <input type="text" className="form-control noOfDays"  onChange={handleChangeForm} id="noOfDays" value={form.noOfDays} placeholder="Default:30days"/>
            </div>
            { canBeSubmitted?<button type="button" className="btn btn-primary" onClick={addOfferUSer}>Add</button>:<button type="button" className="btn btn-primary" disabled>Add</button>}
            {/* {addSuccess && <p className="successMsg">Offer User added Successfully</p>}
            {addFailure && <p className="failureMsg">Please Try Again</p>} */}
        </form>
    </div>)
}

export default AdminAddOfferUser;
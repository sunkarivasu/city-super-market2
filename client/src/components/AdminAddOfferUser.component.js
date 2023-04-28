import React,{useEffect,useState} from "react";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";


function AdminAddOfferUser()
{
    var initialState ={
        name:"",
        phoneNumber:"",
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
            if (form.nameErr=="" && form.phoneNumberErr=="")
                setCanBeSubmitted(true);
            else
                setCanBeSubmitted(false);
        }

        function reset()
        {
            setForm(initialState);
            // setAddSuccess(false);
            // setAddFailure(false);
            setCanBeSubmitted(false);
            setAdd(false);
            setCheckForm(false);
        }
      
        if(checkForm)
        {
            validate()
            setCheckForm(false)
        }

        if(add)
        {
            var newOfferUser = {...form}
            axios.post("/offerUsers/add",newOfferUser)
            .then(() => {console.log("Offer added by admin")
                        // setAddSuccess(true)
                        // setAddFailure(false)
                        toast.success("Offer added successfully",{position:toast.POSITION.BOTTOM_CENTER});
                        reset();
                        })
            .catch((err) => {console.log("Error:"+err)
                            // setAddFailure(true)
                            // setAddSuccess(false)
                            toast.error("Some Error occured. Please try again",{position:toast.POSITION.BOTTOM_CENTER});
                        });
            setAdd(false)
        }

        // if(addSuccess)
        // {
        //     toast.success("Offer added successfully",{position:toast.POSITION.BOTTOM_CENTER});
        //     reset()
        // }

        // if(addFailure)
        // {
        //     toast.error("Some Error occured. Please try again",{position:toast.POSITION.BOTTOM_CENTER});
        // }

    // },[checkForm,addSuccess,add,addFailure])
    },[checkForm,add])


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
            { canBeSubmitted?<button type="button" className="btn btn-primary" onClick={() =>{setAdd(true)}}>Add</button>:<button type="button" className="btn btn-primary" disabled>Add</button>}
            {/* {addSuccess && <p className="successMsg">Offer User added Successfully</p>}
            {addFailure && <p className="failureMsg">Please Try Again</p>} */}
        </form>
    </div>)
}

export default AdminAddOfferUser;
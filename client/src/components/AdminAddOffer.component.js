import React,{useEffect,useState} from "react";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {storage} from "../firebase";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import axios from "axios";


function AdminAddOffer()
{

    var initialState ={
        productName:"",
        description:"",
        price:"",
        image:"",
        productNameErr:"init",
        descriptionErr:"init",
        priceErr:"init",
        imageErr:"init",
    }

    var [form,setForm] = useState(initialState);
    var [addSuccess,setAddSuccess] = useState(false);
    var [addFailure,setAddFailure] = useState(false);
    var [canBeSubmitted,setCanBeSubmitted] = useState(false);
    var [checkForm,setCheckForm] = useState(false);
    var [add,setAdd] = useState(false);
    var [imageFile,setImageFile] = useState(null);
    var [imageFileUrl,setImageFileUrl] = useState(null);

    useEffect(() => {

        function validate()
        {
            if (form.productNameErr=="" && form.priceErr==""  && form.descriptionErr=="" && imageFile)
                setCanBeSubmitted(true);
            else
                setCanBeSubmitted(false);
        }

        function reset()
        {
            setForm(initialState);
            setAddSuccess(false);
            setAddFailure(false);
            setCanBeSubmitted(false);
            setAdd(false);
            setCheckForm(false);
        }

        function uploadImage()
        {
            var uploadImagePromise = new Promise(function(resolve,reject) {
                console.log(imageFile)
                const childRef = ref(storage,form.productName+form.description+form.price+"/image");
    
                uploadBytes(childRef,imageFile).then(()=>
                {
                    getDownloadURL(childRef).then((url) =>
                    {
                    setForm({...form,image:url,imageErr:""})
                    console.log(url);
                    resolve(url)
                    })
                    .catch((err) =>{
                    reject(err)
                    console.log("Error occured while uploading image"+err);
                    })
                })
                .catch((err)=>{
                    console.log("Error occured while downloading the url"+err)
                    reject(err)
                }) 
            });

            return uploadImagePromise;
    
        }
        
        if(checkForm)
        {
            validate()
            setCheckForm(false)
        }

        if(add)
        {
            uploadImage()
            .then(function (url)
                {
                    console.log({url});
                    var newOffer = {...form,image:url}
                    axios.post("/offers/add",newOffer)
                    .then(() => {console.log("Offer added by admin")
                                setAddSuccess(true)
                                setAddFailure(false)
                                })
                    .catch((err) => {console.log("Error:"+err)
                                    setAddFailure(true)
                                    setAddSuccess(false)});
            })
            .catch((err) => console.log(err))
            setAdd(false)
        }

        if(addSuccess)
        {
            toast.success("Offer added successfully",{position:toast.POSITION.BOTTOM_CENTER});
            reset()
        }

        if(addFailure)
        {
            toast.error("Some Error occured. Please try again",{position:toast.POSITION.BOTTOM_CENTER});
        }

    },[checkForm,addSuccess,add,addFailure])

    function handleChangeImage(event)
    {
        if(event.target.files[0])
        {
            setImageFile(event.target.files[0])
            setImageFileUrl(URL.createObjectURL(event.target.files[0]))
        }
        else if (imageFile === null)
        {
            setForm({...form,image:"",imageErr:"Please upload image"})
        }
        setCheckForm(true);
    }

    function handleChangeForm(event)
    {
        if(event.target.id=="price")
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


    function validateForm(field,value)
    {
        switch(field)
        {
        case 'productName':
            if(value.length<3)
            setForm({...form,productNameErr:"Product Name should contain atleast 3 characters",productName:value})
            else if (!value.match(/^[a-zA-Z ]{3,}$/gm))
            {
            setForm({...form,productNameErr:"Product Name should only contain characters",productName:value})
            }
            else
            setForm({...form,productNameErr:"",productName:value})
            break
        case 'price':
            if(value.length==0)
            setForm({...form,priceErr:"Enter Price",price:value})
            else
            setForm({...form,priceErr:"",price:value})          
            break
        case "description":
            if(value.length==0)
            setForm({...form,descriptionErr:"Enter Description",description:value})
            else
            setForm({...form,descriptionErr:"",description:value})       
        }
    }

    return(<div className="adminAddOffer">
        <form className="admin-form adminAddOffer-form">
          <p className="adminForm-title">Add Offer</p>
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input type="text" className="form-control productName" id="productName" onChange={handleChangeForm} value={form.productName} placeholder=""/>
            { form.productNameErr.length>0 && form.productNameErr!="init" && <p className="adminErr err">{form.productNameErr}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="productDescription">Description</label>
            <textarea cols="20" rows="4" className="form-control" id="description" onChange={handleChangeForm} value={form.description}></textarea>
            { form.descriptionErr.length>0 && form.descriptionErr!="init" && <p className="adminErr err">{form.descriptionErr}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="price">Worth</label>
            <input type="text" className="form-control price"  onChange={handleChangeForm} id="price" value={form.price}/>
            { form.priceErr.length>0 && form.priceErr!="init" && <p className="adminErr err">{form.priceErr}</p>}
          </div>  
          <div className="form-group">
            <label htmlFor="productImage">Product Image</label>
            {imageFile && <img src={imageFileUrl} style={{display:"block",width:"200px",height:"200px",margin:"10px"}}/>}
            <input type="file" accept="image/*" className="productImage" onChange={handleChangeImage}  id="image" />
            { form.imageErr.length>0 && form.imageErr!="init" && <p className="adminErr err">{form.imageErr}</p>}
          </div>        
          { canBeSubmitted?<button type="button" className="btn btn-primary" onClick={() =>{setAdd(true)}}>Add</button>:<button type="button" className="btn btn-primary" disabled>Add</button>}
          {addSuccess && <p className="successMsg">Offer added Successfully</p>}
          {addFailure && <p className="failureMsg">Please Try Again</p>}
      </form>
    </div>
    )
}

export default AdminAddOffer;
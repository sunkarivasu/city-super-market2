import axios from "axios";
import React, { useEffect } from "react";
import { useState} from "react";
import "../css/style.css";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import {storage} from "../firebase";

function AdminUpdateNormalOffer(props)
{

  var intialState = 
  {
    productName:"",
    description:"",
    image:"",
    discount:"",
    price:"",
    priceErr:"",
    discountErr:"",
    descriptionErr:"",
    productNameErr:"",
    imageErr:""
  }

  var [form,setForm] = useState(intialState)
  var [canBeSubmitted,setCanBeSubmitted] = useState(false);
  var [checkForm,setCheckForm] = useState(false)
  var [updateSuccess,setUpdateSuccess] = useState(false);
  var [updateFailure,setUpdateFailure] = useState(false);
  var [update,setUpdate] = useState(false);
  var [imageFile,setImageFile] = useState(null)
  var [imageFileUrl,setImageFileUrl] = useState(null)


  if(updateSuccess)
    {
      toast.success("Normal Offer updated successfully",{position:toast.POSITION.BOTTOM_CENTER});
      props.handleShowAllNormalOffers();
    }

    if(checkForm)
    {
      validate()
      setCheckForm(false)
    }


    function validate()
    {
      if (form.productNameErr=="" && form.priceErr=="" && form.discountErr=="" && form.descriptionErr=="" && imageFileUrl)
      {
          console.log("can be submitted");
          setCanBeSubmitted(true);
      }
      else
      {
          setCanBeSubmitted(false);
      }
    }

    function uploadImage()
    {
        var uploadImagePromise = new Promise(function(resolve,reject) {
            const childRef = ref(storage,form.productName+form.price+"/image");

            if(imageFile === null)
            {
                console.log("image not changed..");
                resolve(null)
            }
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

    function updateNormalOffer()
      {
        uploadImage()
        .then((url) =>
        {
            if(url)
                form['image'] = url
            axios.put("/normalOffers/updateNormalOfferDetails",{...form,_id:props.offerId})
            .then(() => {console.log("Normal Offer updated by admin")
                setUpdateSuccess(true)
                setUpdateFailure(false)})
            .catch((err) => {console.log("Error:"+err)
              setUpdateSuccess(false)
              setUpdateFailure(true)});
              setUpdate(false);
        })
        .catch((err) =>
        {
            console.log("Error occured while uploading image");
        })
        
      }

  useEffect(() => {
    axios.get("/normalOffers/idNo/"+props.offerId)
      .then((res) => {
        setForm({...intialState,...res.data})
        setImageFileUrl(res.data.image)
    })
      .catch((err) => {console.log("Error occured while fetching normal offer details",err);})
    return () => {}
  },[]);

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
      case "discount":
        if(value.length==0)
          setForm({...form,discountErr:"Enter Discount",discount:value})
        else if(value<0 || value>100)
          setForm({...form,discountErr:"Discount sholud be in between 0 and 100",discount:value})
        else
          setForm({...form,discountErr:"",discount:value})
        break
      case "description":
        if(value.length==0)
          setForm({...form,descriptionErr:"Enter Description",description:value})
        else
          setForm({...form,descriptionErr:"",description:value})  
    }
}

  function handleChangeForm(event)
  {
    console.log(form);
    if(event.target.id=="discount"|| event.target.id=="price")
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
      console.log(form);
    }
    setCheckForm(true)
  }


  function handleChangeImage(event)
  {
    console.log("Image changed");
    console.log(event.target.files[0]);
    if(event.target.files[0])
    {
      setImageFile(event.target.files[0])
      setImageFileUrl(URL.createObjectURL(event.target.files[0]))
    }
    else
    { 
        if(!imageFileUrl)
            setForm({...form,image:"",imageErr:"Please upload image"});
    }
    setCheckForm(true)

  }

    return(<div className="adminUpdateProduct">
        <form className="admin-form adminUpdateProduct-form" onSubmit={(e) =>{e.preventDefault();}}>
          <p className="adminForm-title">Update Normal Offer</p>
          <div className="form-group">
            <label for="productName">Product Name</label>
            <input type="text" className="form-control productName" id="productName" onChange={handleChangeForm} value={form.productName} placeholder=""/>
            { form.productNameErr.length>0 && form.productNameErr!="init" && <p className="adminErr err">{form.productNameErr}</p>}
          </div>
          <div className="form-group" >
            <label for="productImage">Product Image</label>
            {imageFileUrl && <img src={imageFileUrl} style={{display:"block",width:"200px",height:"200px",margin:"10px"}}/>}
            <input type="file" className="productImage" onChange={handleChangeImage} id="image"/>
            { form.imageErr.length>0 && form.imageErr!="init" && <p className="adminErr err">{form.imageErr}</p>}
          </div>
          <div className="form-group" >
            <label for="price">Price</label>
            <input type="text" className="form-control price"  onChange={handleChangeForm} id="price" value={form.price}/>
            { form.priceErr.length>0 && form.priceErr!="init" && <p className="adminErr err">{form.priceErr}</p>}
          </div>
          <div className="form-group" >
            <label for="productDiscount">Discount</label>
            <input type="text" className="form-control productDiscount"  onChange={handleChangeForm} id="discount" value={form.discount}/>
            { form.discountErr.length>0 && form.discountErr!="init" &&  <p className="adminErr err">{form.discountErr}</p>}
          </div>
          <div className="form-group" >
            <label for="productDescription">Description</label>
            <textarea cols="20" rows="4" className="form-control" id="description" onChange={handleChangeForm} value={form.description}></textarea>
            { form.descriptionErr.length>0 && form.descriptionErr!="init" && <p className="adminErr err">{form.descriptionErr}</p>}
          </div>
          { canBeSubmitted?<button type="button" className="btn btn-primary"  onClick={updateNormalOffer}>Update</button>:<button type="button" className="btn btn-primary" disabled>Update</button>}
          {updateSuccess && <p className="successMsg" >Normal Offer Updated Successfully</p>}
          {updateFailure && <p className="failureMsg">Please Try Again</p>}   
      </form>
    </div>
    )
};

export default AdminUpdateNormalOffer;


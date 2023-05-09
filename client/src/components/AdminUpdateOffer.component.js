import axios from "axios";
import React, { useEffect } from "react";
import { useState} from "react";
import "../css/style.css";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import {storage} from "../firebase";

function AdminUpdateOffer(props)
{

  var intialState = 
  {
    productName:"",
    worth:"",
    winnerName:"",
    winnerPhoneNumber:"",
    winnerImage:"",
    image:"",
    productNameErr:"",
    worthErr:"",
    winnerNameErr:"",
    winnerPhoneNumberErr:"",
    winnerImageErr:"",
    imageErr:"",
  }

  var [form,setForm] = useState(intialState)
  // var [categoryList,setCategoryList] = useState([]);
  var [canBeSubmitted,setCanBeSubmitted] = useState(false);
  var [checkForm,setCheckForm] = useState(false)
  var [updateSuccess,setUpdateSuccess] = useState(false);
  var [updateFailure,setUpdateFailure] = useState(false);
  var [update,setUpdate] = useState(false);
  var [imageFile,setImageFile] = useState(null);
  var [imageFileUrl,setImageFileUrl] = useState(null);
  var [winnerImageFile,setWinnerImageFile] = useState(null);
  var [winnerImageFileUrl,setWinnerImageFileUrl] = useState(null);
  // var [search,setSearch] = useState(false);
  // var [productNotFound,setProductNotFound] = useState("none");
  // var [display,setDisplay] = useState("none");
  // var [readOnly,setReadOnly] = useState(false);
  // var [displaySearch,setDisplaySearch] = useState(true);
  // var [categoryChanged,setCategoryChanged] = useState(false);
  // var [subCategoryList,setSubCategoryList] = useState([]);
  // var [disableSearch,setDisableSearch] = useState(true);

  if(updateSuccess)
    {
      toast.success("Offer updated successfully",{position:toast.POSITION.BOTTOM_CENTER});
      props.handleShowAllOffers();
    }

    if(checkForm)
    {
      validate()
      setCheckForm(false)
    }


    function validate()
    {
        console.log("validating...",form);
      if (form.productNameErr=="" && form.winnerNameErr=="" && form.imageErr=="" && form.worthErr=="")
      {
          console.log("can be submitted");
          setCanBeSubmitted(true);
      }
      else
      {
          setCanBeSubmitted(false);
      }
    }

    // if(categoryChanged)
    // {
    //   getSubCategories();
    //   setForm({...form,subCategoryErr:"Select Sub Category"})
    //   setCategoryChanged(false)
    // }
    

    // function getSubCategories()
    // {
    //   console.log("changed:"+form.category);
    //   if(form.category=="none")
    //   {
    //     setSubCategoryList([])
    //     setForm({...form,subCategoryErr:"Select Sub Category"})
    //   }
    //   else
    //   {
    //     axios.get("/categories/getSubCategories/"+form.category)
    //     .then((res) => {setSubCategoryList(res.data);
    //     console.log(form.category+" "+subCategoryList)})
    //     .catch((err) => {console.log("Error while fetching sub categoryList:"+err)}) 
    //   }  
    // }


    function updateOffer()
    {
        console.log("updating offer..");
        uploadImage(imageFile,"image")
        .then(function (imageUrl)
            {
                console.log({imageUrl});
                uploadImage(winnerImageFile,"winnerImage")
                .then((winnerImageUrl)=>{
                    console.log({winnerImageUrl});
                    var newOffer = {
                        _id:props.offerId,
                        productName:form.productName,
                        winnerPhoneNumber:form.winnerPhoneNumber,
                        winnerName:form.winnerName,
                        worth:form.worth,
                        }
                    if(imageUrl)
                        newOffer['image'] = imageUrl
                    if(winnerImageUrl)
                        newOffer['winnerImage'] = winnerImageUrl
                    axios.put("/offers/updateOfferDetails",newOffer)
                    .then(() => {console.log("Offer updated by admin")
                        setUpdateSuccess(true)
                        setUpdateFailure(false)})
                    .catch((err) => {console.log("Error:"+err)
                    setUpdateSuccess(false)
                    setUpdateFailure(true)});
                    setUpdate(false);
            
                })
                .catch((err) =>
                {
                    console.log("error occured while uploading winner image..",err);
                })
        })
        .catch((err) => console.log(err))
        setUpdate(false)
    }
    
  useEffect(() => {
    // console.log(props.productId);
    axios.get("/offers/idNo/"+props.offerId)
      .then((res) => {
        setForm({...intialState,...res.data})
        setImageFileUrl(res.data.image)
        setWinnerImageFileUrl(res.data.winnerImage)
    console.log(res.data);
    })
      .catch((err) => {console.log("Error occured while fetching offer details");})
    return () => {}
  },[]);

  function validateForm(field,value)
  {
    switch(field)
    {
      case 'winnerName':
        if(value.length<3)
          setForm({...form,winnerNameErr:"Winner Name should contain atleast 3 characters",winnerName:value})
        else if (!value.match(/^[a-zA-Z ]{3,}$/gm))
        {
          setForm({...form,winnerNameErr:"Product Name should only contain characters",winnerName:value})
        }
        else
          setForm({...form,winnerNameErr:"",winnerName:value})
        break
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
      case 'worth':
        if(value.length==0)
          setForm({...form,worthErr:"Enter Worth",worth:value})
        else
          setForm({...form,worthErr:"",worth:value})          
        break
    }
}

  function handleChangeForm(event)
  {
    console.log(form);
    if(event.target.id=="worth" || event.target.id=="winnerPhoneNumber")
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
        console.log(event.target.files[0],event.target.id);
        if(event.target.id === 'image')
        {
            // if(event.target.files[0])
            // {
                console.log("image")
                setImageFile(event.target.files[0])
                setImageFileUrl(URL.createObjectURL(event.target.files[0]))
            // }
            // else if (image === null)
            // {
            //     setForm({...form,image:"",imageErr:"Please upload image"})
            // }
        }
        else if (event.target.id === 'winnerImage')
        {
            // if(event.target.files[0])
            // {
                console.log("winnerImage");
                setWinnerImageFile(event.target.files[0])
                setWinnerImageFileUrl(URL.createObjectURL(event.target.files[0]))
            // }
            // else if (image === null)
            // {
                // setForm({...form,winneImage:"",winnerImageErr:"Please upload image"})
            // }
        }
        setCheckForm(true);
    }


    function uploadImage(image,type)
    {
        var uploadImagePromise = new Promise(function(resolve,reject) {
            console.log(image)
            const childRef = ref(storage,form.productName+type+form.worth+"/image");
            console.log({childRef});

            if(image === null)
            {
                console.log("image not changed..");
                resolve(null)
            }
            uploadBytes(childRef,image).then(()=>
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
    


    return(<div className="adminUpdateOffer">
        <form className="admin-form adminUpdateOffer-form" onSubmit={(e) =>{e.preventDefault();}}>
          <p className="adminForm-title">Update Offer</p>
          <div className="form-group">
            <label for="productName">Product Name</label>
            <input type="text" className="form-control productName" id="productName" onChange={handleChangeForm} value={form.productName} placeholder=""/>
            { form.productNameErr.length>0 && form.productNameErr!="init" && <p className="adminErr err">{form.productNameErr}</p>}
          </div>
          <div className="form-group" >
            <label for="productImage">Product Image</label>
            {imageFileUrl && <img src={imageFileUrl} style={{display:"block",width:"200px",height:"200px",margin:"10px"}}/>}
            <input type="file" accept="image/*" className="productImage" onChange={handleChangeImage} id="image"/>
            { form.imageErr.length>0 && form.imageErr!="init" && <p className="adminErr err">{form.imageErr}</p>}
          </div>
          <div className="form-group" >
            <label for="worth">Worth</label>
            <input type="text" className="form-control worth"  onChange={handleChangeForm} id="worth" value={form.worth}/>
            { form.worthErr.length>0 && form.worthErr!="init" && <p className="adminErr err">{form.worthErr}</p>}
          </div>
          <div className="form-group" >
            <label for="winnerName">Winner Name</label>
            <input type="text" className="form-control winnerName"  onChange={handleChangeForm} id="winnerName" value={form.winnerName}/>
            { form.winnerNameErr.length>0 && form.winnerNameErr!="init" &&  <p className="adminErr err">{form.winnerNameErr}</p>}
          </div>
          <div className="form-group" >
            <label for="winnerImage">Winner Image</label>
            {winnerImageFileUrl && <img src={winnerImageFileUrl} style={{display:"block",width:"200px",height:"200px",margin:"10px"}}/>}
            <input type="file" accept="image/*" className="winnerImage" onChange={handleChangeImage} id="winnerImage"/>
            { form.winnerImageErr.length>0 && form.winnerImageErr!="init" &&  <p className="adminErr err">{form.winnerImageErr}</p>}
          </div>
          { canBeSubmitted?<button type="button" className="btn btn-primary"  onClick={updateOffer}>Update</button>:<button type="button" className="btn btn-primary" disabled>Update</button>}
          {updateSuccess && <p className="successMsg" >Product Updated Successfully</p>}
          {updateFailure && <p className="failureMsg">Please Try Again</p>}   
      </form>
    </div>
    )
};

export default AdminUpdateOffer;


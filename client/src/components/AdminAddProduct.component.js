import axios from "axios";
import React, { useEffect } from "react";
import { useState} from "react";
import "../css/style.css";
import { useNavigate} from "react-router-dom";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {storage} from "../firebase";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";



function AdminAddProduct(props)
{
  
    var navigate = useNavigate()
    var intialState = 
    {
        category:"",
        subCategory:"",
        brand:"",
        description:"",
        image:"",
        quantity:"",
        discount:"",
        price:"",
        categoryErr:"init",
        subCategoryErr:"init",
        priceErr:"init",
        discountErr:"init",
        descriptionErr:"init",
        brandErr:"init",
        quantityErr:"init",
        imageErr:"init"
    }

    var [form,setForm] = useState(intialState)
    var [categoryList,setCategoryList] = useState([]);
    var [canBeSubmitted,setCanBeSubmitted] = useState(false);
    var [checkForm,setCheckForm] = useState(false)
    var [addSuccess,setAddSuccess] = useState(false);
    var [addFailure,setAddFailure] = useState(false);
    var [add,setAdd] = useState(false);
    var [categoryChanged,setCategoryChanged] = useState(false);
    var [subCategoryList,setSubCategoryList] = useState([]);
    // var [productImage,setProductImage] = useState(null);
    // var [imageChanged,setImageChanged] = useState();

    if(addSuccess)
    {
      toast.success("Product added successfully",{position:toast.POSITION.BOTTOM_CENTER});
      props.handleShowAllProducts();
      // setTimeout(() =>
      // {
      //   setForm(intialState);
      //   setAddSuccess(false);
      //   setAddFailure(false);
      //   setAdd(false);
      // },5000)
    }

    if(checkForm)
    {
      validate()
      setCheckForm(false)
    }


    function validate()
    {
      if (form.categoryErr=="" && form.subCategoryErr=="" && form.brandErr=="" && form.priceErr=="" && form.discountErr=="" && form.descriptionErr==""  && form.quantityErr=="" && form.imageErr=="")
      {
          // console.log(form,"can be submitted");
          setCanBeSubmitted(true);
      }
      else
      {
          // console.log(form);
          setCanBeSubmitted(false);
      }
    }

    if(add)
    {
      addProduct()
      setAdd(false)
    }
    

    function addProduct()
    {
          var newProduct = {
            category:form.category,
            subCategory:form.subCategory,
            price:form.price,
            discount:form.discount,
            description:form.description,
            brand:form.brand,
            quantity:form.quantity,
            image:form.image
          }
          axios.post("/products/add",newProduct)
          .then(() => {console.log("Product added by admin")
                      setAddSuccess(true)
                      setAddFailure(false)
                    })
          .catch((err) => {console.log("Error:"+err)
                          setAddFailure(true)
                          setAddSuccess(false)});
    }

  
  useEffect(() =>{

    axios.get("/categories/")
    .then((res) => {setCategoryList(res.data)})
    .catch((err) => {console.log("Error while fetching categories:"+err)});
    
    if(categoryChanged)
    {
      getSubCategories();
      setCategoryChanged(false)
    }
    

    function getSubCategories()
    {
      if(form.category=="none")
      {
        setSubCategoryList([])
        setForm(intialState)
      }
      else
      {
        axios.get("/categories/getSubCategories/"+form.category)
        .then((res) => {setSubCategoryList(res.data);
        // console.log(form.category+" "+subCategoryList)
      })
        .catch((err) => {console.log("Error while fetching sub categoryList:"+err)}) 
      } 
    } 


    return () =>{

    }
  },[categoryChanged]);



  function handleChangeCategory(event)
  {
      setForm({...form,[event.target.id]:event.target.value})
      validateForm(event.target.id,event.target.value);
      setCategoryChanged(true)
      setCheckForm(true)
  }


  function validateForm(field,value)
  {
    switch(field)
    {
      case 'category':
        if(value=="None" || value=="")
        {
          setForm({...form,categoryErr:"Select Category",category:"none"})
        }
        else
          setForm({...form,categoryErr:"",[field]:value})
        break
      case 'subCategory':
        if(value=="None" || value=="")
          setForm({...form,subCategoryErr:"Select Sub Category",[field]:value})
        else
          setForm({...form,subCategoryErr:"",[field]:value})
        break
      case 'brand':
        if(value.length<3)
          setForm({...form,brandErr:"Product Name should contain atleast 3 characters",brand:value})
        else if (!value.match(/^[a-zA-Z ]{3,}$/gm))
        {
          setForm({...form,brandErr:"Product Name should only contain characters",brand:value})
        }
        else
          setForm({...form,brandErr:"",brand:value})
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
      case "quantity":
        if(value.length==0)
          setForm({...form,quantityErr:"Enter Quantity",quantity:value})
        else
          setForm({...form,quantityErr:"",quantity:value})          
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
    if(event.target.id=="discount" || event.target.id=="quantity" || event.target.id=="price")
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


  function createCategoryOption(props)
  {
      return (
      <option value={props.categoryName}>{props.categoryName}</option>
      );
  }

  function createSubCategoryOption(props)
  {
    return(
      <option value={props}>{props}</option>
    )
  }

  
  function handleChangeImage(event)
  {
    console.log(event.target.files[0]);
    if(event.target.files[0])
    {
      //setProductImage(event.target.files[0])
      UploadFile(event.target.files[0])
    }
    else
    {
        setForm({...form,image:"",imageErr:"Please upload image"})
        setCheckForm(true);
    }
  }

  function UploadFile(image)
  {
    console.log(image)
    const imageRef = ref(storage,form.category+form.subCategory+form.brand);
    const childRef = ref(storage,form.category+form.subCategory+form.brand+"/image");

      uploadBytes(childRef,image).then(()=>
      {
        getDownloadURL(childRef).then((url) =>
        {
          setForm({...form,image:url,imageErr:""})
          setCheckForm(true);
          console.log(url);
        })
        .catch((err) =>{
          console.log("Error occured while uploading image"+err);
        })
      })
      .catch((err)=>{console.log("Error occured while downloading the url"+err)}) 

  }




    return(<div className="adminAddProduct">
        <form className="admin-form adminAddProduct-form">
          <p className="adminForm-title">Add Product</p>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select className="form-control category" id="category" onChange={handleChangeCategory} value={form.category}>
              <option value="None">None</option>
              {categoryList.map(createCategoryOption)}
            </select>
            { form.categoryErr.length>0 && form.categoryErr!="init" && <p className="adminErr err">{form.categoryErr}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="subCategory">Sub Category</label>
            <select className="form-control subCategory" id="subCategory" onChange={handleChangeForm}  placeholder="" value={form.subCategory}>
              <option value="None">None</option>
              {subCategoryList.map(createSubCategoryOption)}
            </select>
            { form.subCategoryErr.length>0 && form.subCategoryErr!="init" && <p className="adminErr err">{form.subCategoryErr}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input type="text" className="form-control productName" id="brand" onChange={handleChangeForm} value={form.brand} placeholder=""/>
            { form.brandErr.length>0 && form.brandErr!="init" && <p className="adminErr err">{form.brandErr}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="productImage">Product Image</label>
            {form.image && <img src={form.image} style={{display:"block",width:"200px",height:"200px",margin:"10px"}}/>}
            <input type="file" className="productImage" onChange={handleChangeImage}  id="image" />
            { form.imageErr.length>0 && form.imageErr!="init" && <p className="adminErr err">{form.imageErr}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input type="text"  className="form-control quantity" id="quantity" onChange={handleChangeForm}  placeholder="" value={form.quantity}/>
            { form.quantityErr.length>0 && form.quantityErr!="init" && <p className="adminErr err">{form.quantityErr}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input type="text" className="form-control price"  onChange={handleChangeForm} id="price" value={form.price}/>
            { form.priceErr.length>0 && form.priceErr!="init" && <p className="adminErr err">{form.priceErr}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="productDiscount">Discount</label>
            <input type="text" className="form-control productDiscount"  onChange={handleChangeForm} id="discount" value={form.discount}/>
            { form.discountErr.length>0 && form.discountErr!="init" &&  <p className="adminErr err">{form.discountErr}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="productDescription">Description</label>
            <textarea cols="20" rows="4" className="form-control" id="description" onChange={handleChangeForm} value={form.description}></textarea>
            { form.descriptionErr.length>0 && form.descriptionErr!="init" && <p className="adminErr err">{form.descriptionErr}</p>}
          </div>
          { canBeSubmitted?<button type="button" className="btn btn-primary" onClick={() =>{setAdd(true)}}>Add</button>:<button type="button" className="btn btn-primary" disabled>Add</button>}
          {addSuccess && <p className="successMsg">Product added Successfully</p>}
          {addFailure && <p className="failureMsg">Please Try Again</p>}
      </form>
    </div>
    )
};

export default AdminAddProduct;

// https://github.com/sunkarivasu/city-super-market.git
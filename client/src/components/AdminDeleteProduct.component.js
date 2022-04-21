import React, { useState,useEffect,useRef} from "react";
import "../css/style.css"; 
import axios from "axios";


function AdminDeleteProduct()
{

  var intialState = 
  {
    category:"",
    subCategory:"",
    productId:"",
    brand:"",
    description:"",
    image:"",
    quantity:"",
    discount:"",
    price:"",
    categoryErr:"init",
    subCategoryErr:"init",
    priceErr:"",
    discountErr:"",
    descriptionErr:"",
    brandErr:"init",
    quantityErr:"",
    imageErr:""
  }

  var [form,setForm] = useState(intialState)
  var [categoryList,setCategoryList] = useState([]);
  var [canBeSubmitted,setCanBeSubmitted] = useState(false);
  var [checkForm,setCheckForm] = useState(false)
  var [deleteSuccess,setDeleteSuccess] = useState(false);
  var [deleteFailure,setDeleteFailure] = useState(false);
  var [Delete,setDelete] = useState(false);
  var [search,setSearch] = useState(false);
  var [productNotFound,setProductNotFound] = useState("none");
  var [display,setDisplay] = useState("none");
  var [readOnly,setReadOnly] = useState(false);
  var [displaySearch,setDisplaySearch] = useState(true);
  var [disabledSearch,setDisableSearch] = useState(true);
  var [categoryChanged,setCategoryChanged] = useState(false);
  var [subCategoryList,setSubCategoryList] = useState([]);


  useEffect(() =>{
    axios.get("/categories/")
    .then((res) => {setCategoryList(res.data)})
    .catch((err) => {console.log("Error while fetching categories:"+err)});

    if(search)
      {
          console.log("Search clicked")
          axios.get("/products/searchProductDetailsToUpdate/"+form.category+"/"+form.subCategory+"/"+form.brand)
          .then((res) =>{
              if(res.data.length==0)
              {
                console.log(form.category+" "+form.subCategory+" "+form.brand+"No product found");
                setProductNotFound("block");
              }
              else
              {
                setForm({...form,productId:res.data[0]._id,quantity:res.data[0].quantity,image:res.data[0].image,description:res.data[0].description,price:res.data[0].price,discount:res.data[0].discount})
                console.log(form)
                setReadOnly(true);
                setDisplay("block");
                setDisplaySearch("none");
                setProductNotFound("none");
              }
            setSearch(false);
              
            }).catch((err) =>{console.log("Error while searching the product:"+err)});
      }
    
    if(categoryChanged)
    {
      getSubCategories();
      setForm({...form,subCategoryErr:"Select Sub Category"})
      setCategoryChanged(false)
    }
    

    function getSubCategories()
    {
      console.log("changed:"+form.category);
      if(form.category=="none")
      {
        setSubCategoryList([])
        setForm({...form,subCategoryErr:"Select Sub Category"})
      }
      else
      {
        axios.get("/categories/getSubCategories/"+form.category)
        .then((res) => {setSubCategoryList(res.data);
        console.log(form.category+" "+subCategoryList)})
        .catch((err) => {console.log("Error while fetching sub categoryList:"+err)}) 
      }
      
    }  
  },[categoryChanged,search]);

  if(deleteSuccess)
    {
      setTimeout(() =>
      {
        setForm(intialState);
        setDeleteSuccess(false);
        setDeleteFailure(false);
        setDelete(false);
        setDisplay("none");
        setReadOnly(false);
        setDisplaySearch(true);
        setDisableSearch(true);
        // console.log(form)
      },5000)
    }


    if(checkForm)
    {
      validate()
      if(form.categoryErr=="" && form.subCategoryErr=="" && form.brandErr=="")
        setDisableSearch(false)
      else
        setDisableSearch(true);
      setCheckForm(false)
    }


    function validate()
    {
      if (form.categoryErr=="" && form.subCategoryErr=="" && form.brandErr=="" && form.priceErr=="" && form.discountErr=="" && form.descriptionErr==""  && form.quantityErr=="")
      {
          console.log("can be submitted");
          setCanBeSubmitted(true);
      }
      else
      {
          setCanBeSubmitted(false);
      }
    }

    if(Delete)
    {
      deleteProduct()
      setDelete(false)
    }
    

    function deleteProduct()
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
                  axios.delete("/products/delete/"+form.productId)
                  .then(() => {console.log("Product deleted by admin")
                  setDeleteSuccess(true)
                  setDeleteFailure(false)
                  setReadOnly(true);
                  setDisplay("inline");
                  setDisplaySearch("none");
                  setProductNotFound("none");
                  setDelete(false);
                  // reset()
                  })
                  .catch((err) => {console.log("Error:"+err)});
                  setDelete(false);
      }
      


  function handleSearchClick()
  {
      setSearch(true);
  }

  function handleChangeCategory(event)
  {
      // console.log(event.target.id,event.target.value)
      setForm({...form,[event.target.id]:event.target.value})
      validateForm(event.target.id,event.target.value);
      setCategoryChanged(true)
      setCheckForm(true)
  }

  

  function validateForm(field,value)
  {
    console.log(field,value);
    switch(field)
    {
      case 'category':
        if(value=="None" || value=="")
        {
          setForm({...form,categoryErr:"Select Category",category:"none"})
          // console.log("Iam here",form)
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
          console.log("Iam here",form)
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
    console.log(event.target.value,event.target.id);
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
      console.log("form:"+form);
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
    //console.log(props);
    return(
      <option value={props}>{props}</option>
    )
  }

    return(<div className="adminDeleteProduct">
        <form className="admin-form adminDeleteProduct-form" onSubmit={(e) =>{e.preventDefault();}}>
          <p className="adminForm-title">Delete Product</p>
          <div class="form-group">
            <label for="category">Category</label>
            <select className="form-control category" id="category" onChange={handleChangeCategory} value={form.category} disabled={readOnly}>
              <option value="None" selected>None</option>
              {categoryList.map(createCategoryOption)}
            </select>
            { form.categoryErr.length>0 && form.categoryErr!="init" && <p className="adminErr err">{form.categoryErr}</p>}
          </div>
          <div className="form-group">
            <label for="subCategory">Sub Category</label>
            <select className="form-control subCategory" id="subCategory" onChange={handleChangeForm}  placeholder="" value={form.subCategory} disabled={readOnly}>
              <option value="None" selected>None</option>
              {subCategoryList.map(createSubCategoryOption)}
            </select>
            { form.subCategoryErr.length>0 && form.subCategoryErr!="init" && <p className="adminErr err">{form.subCategoryErr}</p>}
          </div>
          <div className="form-group">
            <label for="productName">Product Name</label>
            <input type="text" className="form-control productName" id="brand" onChange={handleChangeForm} value={form.brand} placeholder="" readOnly={readOnly}/>
            { form.brandErr.length>0 && form.brandErr!="init" && <p className="adminErr err">{form.brandErr}</p>}
          </div>
          <div className="form-group" style={{display:display}}>
            <label for="productImage">Product Image</label>
            <img src={form.image} style={{display:"block",width:"200px",height:"200px",margin:"10px 0px"}}/>
            {/* <input type="file" className="productImage" onChange={handleChangeForm} id="image" value={form.image} readOnly={readOnly}/> */}
            {/* { form.imageErr.length>0 && form.imageErr!="init" && <p className="adminErr err">{form.imageErr}</p>} */}
          </div>
          <p className="productNotFound" style={{color:"red",display:productNotFound}}>No Product Found</p>
          <button className="btn btn-primary" onClick={handleSearchClick} style={{display:displaySearch}} disabled={disabledSearch}>search</button>
          <div className="form-group" style={{display:display}}>
            <label for="quantity">Quantity</label>
            <input type="text"  className="form-control quantity" id="quantity" onChange={handleChangeForm}  placeholder="" value={form.quantity} readOnly={readOnly}/>
            { form.quantityErr.length>0 && form.quantityErr!="init" && <p className="adminErr err">{form.quantityErr}</p>}
          </div>
          <div className="form-group" style={{display:display}}>
            <label for="price">Price</label>
            <input type="text" className="form-control price"  onChange={handleChangeForm} id="price" value={form.price} readOnly={readOnly}/>
            { form.priceErr.length>0 && form.priceErr!="init" && <p className="adminErr err">{form.priceErr}</p>}
          </div>
          <div className="form-group" style={{display:display}}>
            <label for="productDiscount">Discount</label>
            <input type="text" className="form-control productDiscount"  onChange={handleChangeForm} id="discount" value={form.discount} readOnly={readOnly}/>
            { form.discountErr.length>0 && form.discountErr!="init" &&  <p className="adminErr err">{form.discountErr}</p>}
          </div>
          
          <div className="form-group" style={{display:display}}>
            <label for="productDescription">Description</label>
            <textarea cols="20" rows="4" className="form-control" id="description" onChange={handleChangeForm} value={form.description} readOnly={readOnly}></textarea>
            { form.descriptionErr.length>0 && form.descriptionErr!="init" && <p className="adminErr err">{form.descriptionErr}</p>}
          </div>
          { canBeSubmitted?<button type="button" className="btn btn-primary" style={{display:display}} onClick={() =>{setDelete(true)}}>Delete</button>:<button type="button" style={{display:display}}  className="btn btn-primary" disabled>Update</button>}
          {deleteSuccess && <p className="successMsg">Product Deleted Successfully</p>}
          {deleteFailure && <p className="failureMsg">Please Try Again</p>} 
      </form>
    </div>
    )
};

export default AdminDeleteProduct;
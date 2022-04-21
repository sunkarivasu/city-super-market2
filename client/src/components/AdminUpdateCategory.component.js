import axios from "axios";
import React,{useEffect, useState} from "react";
import "../css/style.css";
import {AiOutlineDelete} from "react-icons"
// import DeleteIcon from '@shapla/react-delete-icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import {storage} from "../firebase";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage"

function AdminUpdateCategory()
{
    var intialState = {
        category:"",
        categoryImage:"",
        categoryImageErr:"",
        subCategoryList:[],
        categoryErr:"init",
        newSubCategoryErr:"init",
        subCategoryListErr:""
    }

    var [form,setForm] = useState(intialState);
    var [categoryList,setCategoryList] = useState(null);
    var [categoryChanged,setCategoryChanged] = useState(false);
    var [newSubCategory,setNewSubCategory] = useState("");
    var [checkForm,setCheckForm] = useState(true);
    var [canBeSubmitted,setCanBeSubmitted] = useState(true);
    var [update,setUpdate] = useState(false);
    var [updateSuccess,setUpdateSuccess] = useState(false);
    var [updateFailure,setUpdateFailure] = useState(false);
    var [remove,setRemove] = useState(false)

    if(updateSuccess)
    {
        setTimeout(()=>
        {
            setForm(intialState);
            setNewSubCategory("");
            setCanBeSubmitted(true);
            setUpdateSuccess(false)
            setUpdateFailure(false)
        },3000);
    }

    if(remove && form.subCategoryList.length==0)
        {
            setForm({...form,subCategoryListErr:"Add atleast one Sub Category"})
            setRemove(false)
            setCanBeSubmitted(true);
        }

        if(checkForm)
        {

            if (form.categoryErr=="" && form.subCategoryListErr=="" && form.categoryImageErr=="")
            {
                setCanBeSubmitted(false)
            }
            else
            {
                setCanBeSubmitted(true)
            }
            setCheckForm(false)
        }
        if(update)
        {
            console.log("hi");
            axios.put("/categories/updateCategoryDetails",form)
            .then(()=>{console.log("Category updated by Admin")
            setUpdateSuccess(true)
            setUpdateFailure(false)
            setUpdate(false)
            })
            .catch((err) => {console.log("Error occured while adding category:"+err)
            setUpdateSuccess(false)
            setUpdateFailure(true)
            })
        }
        


    useEffect(() =>
    {
        axios.get("/categories/")
        .then((res) => {setCategoryList(res.data)})
        .catch((err) => {console.log("Error while fetching categories:"+err)})

        if(categoryChanged)
        {
            if(form.category=="None")
            {
                setForm(intialState);
                setCategoryChanged(false)
            }
            else
            {
                console.log("/categories/getCategoryDetails/"+form.category);
                axios.get("/categories/getCategoryDetails/"+form.category)
                .then((res)=>
                {
                    console.log(res.data);
                    setForm({...form,subCategoryList:res.data.subCategoryList,categoryImage:res.data.categoryImage})
                })
                .catch((err) => {console.log("Error while fetching sub categories to update:"+err)});
                setCategoryChanged(false)
            }
        }
    },[categoryChanged]);


    function handleChangeCategory(event)
    {
        console.log("category changed:"+event.target.value);
        if(event.target.value=="None")
            setForm({...form,categoryErr:"Select Category",category:event.target.value,subCategoryListErr:"",newSubCategoryErr:"init"})
        else
            setForm({...form,categoryErr:"",category:event.target.value,subCategoryListErr:"",newSubCategoryErr:"init"})
        setCheckForm(true);
        setNewSubCategory("");
        setCategoryChanged(true);

    }

    function handleChangeCategoryImage(event)
    {
        console.log("image changed"+event.target.files[0]);
    if(event.target.files[0])
    {
      UploadFile(event.target.files[0]);
    }
    else
    {
        setForm({...form,categoryImage:"",categoryImageErr:"Please upload image"})
        setCheckForm(true);
    }
  }

  function UploadFile(image)
  {
    console.log(image)
    const imageRef = ref(storage,form.category);
    const childRef = ref(storage,form.category+"/image");

      uploadBytes(childRef,image).then(()=>
      {
        getDownloadURL(childRef).then((url) =>
        {
          setForm({...form,categoryImage:url,categoryImageErr:""})
          setCheckForm(true);
          console.log(url);
        })
        .catch((err) =>{
          console.log("Error occured while uploading image"+err);
        })
      })
      .catch((err)=>{console.log("Error occured while downloading the url"+err)}) 

  }


    function handleChangeNewSubCategory(event)
    {
        setNewSubCategory(event.target.value);
        if(event.target.value.length==0)
            setForm({...form,newSubCategoryErr:"Enter Sub Category"});
        else if(event.target.value.length<3)
            setForm({...form,newSubCategoryErr:"Sub Category Should contain atleast 3 characters"});
        else if(!event.target.value.match(/^[a-zA-Z ]{3,}$/gm))
            setForm({...form,newSubCategoryErr:"Sub Category should only contain characters"});
        else
            setForm({...form,newSubCategoryErr:""});
        setCheckForm(true)
    }

    function handleUpdateCategory()
    {
        setUpdate(true)
    }

    function handleAddNewSubCategory(event)
    {
        setForm({...form,subCategoryList:[...form.subCategoryList,newSubCategory],newSubCategoryErr:"init",subCategoryListErr:""});
        setNewSubCategory("");
        setCheckForm(true);
        console.log(form);
    }


    return(<div className="adminUpdateCategory">
         <form className="admin-form adminUpdateCategory-form" onSubmit={(e)=> e.preventDefault()}>
             <p className="adminForm-title">Update Category</p>
             <div class="form-group">
                 <label for="category">Category Name</label>
                 <select className="form-control category" id="category" onChange={handleChangeCategory} value={form.category}>
                    <option value="None" selected>None</option>
                    {   categoryList!=null && categoryList.map((element)=>{
                        return (<option value={element.categoryName}>{element.categoryName}</option>)
                    })}
                 </select>
                {form.categoryErr.length>0 && form.categoryErr!="init" && <p className="err adminErr">{form.categoryErr}</p>}

             </div>
             <div className="form-group">
                <label for="categoryImage">Category image</label>
                {form.categoryImage && <img src={form.categoryImage} style={{display:"block",width:"200px",height:"200px",margin:"10px 0px"}}/>}
                 <input type="file" className="categoryImage" id="categoryImage" onChange={handleChangeCategoryImage}  placeholder="Category Image"/>
                {form.categoryImageErr.length>0 && form.categoryImageErr!="init" && <p className="err adminErr">{form.categoryImageErr}</p>}
             </div>
             <div className="form-group">
                 <label for="subCategoryList">Sub Category List</label>
                 {form.subCategoryList.map((element)=>{
                     return <div className="oldCategory">
                         <p className="oldCategoryText">{element}</p>
                         <button className="minus-btn" id={element} onClick={(event) =>
                         {
                             setForm({...form,subCategoryList:form.subCategoryList.filter((element)=>
                             {return  element!=event.target.id})})
                             console.log(form)
                             setRemove(true)
                            
                         }}>-</button>
                     </div>
                 })}
                 {form.subCategoryListErr!="init" && form.subCategoryListErr.length>0 && <p className="err adminErr">{form.subCategoryListErr}</p>}
                 <div className="addNewSubCategory">
                     <input type="text" className="form-control newCategoryText" placeholder="New Sub Category" onChange={handleChangeNewSubCategory} value={newSubCategory}/>
                     {form.newSubCategoryErr==""?<button className="plus-btn" onClick={handleAddNewSubCategory}>+</button>:<button className="plus-btn" onClick={handleAddNewSubCategory} disabled>+</button>}
                 </div>
                 {form.newSubCategoryErr!="init" && form.newSubCategoryErr.length>0 && <p className="err adminErr">{form.newSubCategoryErr}</p>}
             </div>
             <div className="form-group">
                 <button type="submit" className="addCategory-btn btn btn-primary" id="addCategory" onClick={handleUpdateCategory}  disabled={canBeSubmitted}>Update</button>
             </div>
             {updateSuccess && <p className="successMsg">Category updated Successfully</p>}
             {updateFailure && <p className="failureMsg">Please Try Again</p>}
        </form>
        </div>);
        
}

export default AdminUpdateCategory;


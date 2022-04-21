import axios from "axios";
import React,{useEffect, useState} from "react";
import "../css/style.css";
// import DeleteIcon from '@shapla/react-delete-icon';
import {storage} from "../firebase";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage"
// import AdminDeleteCategory from "./AdminDeleteCategory.component";
function AdminAddCategory()
{
    var intialState = {
        category:"",
        categoryImage:"",
        subCategoryList:[],
        categoryErr:"init",
        categoryImageErr:"init",
        newSubCategoryErr:"init",
        subCategoryListErr:"init"
    }

    var [form,setForm] = useState(intialState);
    var [newSubCategory,setNewSubCategory] = useState("");
    var [checkForm,setCheckForm] = useState(true);
    var [canBeSubmitted,setCanBeSubmitted] = useState(true);
    var [add,setAdd] = useState(false);
    var [addSuccess,setAddSuccess] = useState(false);
    var [addFailure,setAddFailure] = useState(false);
    var [remove,setRemove] = useState(false)
    // var [categoryImage,setCategoryImage] =useState();

    if(addSuccess)
        {
            setTimeout(()=>
            {
                setForm(intialState);
                setNewSubCategory("");
                setCanBeSubmitted(true);
                setAddSuccess(false)
                setAddFailure(false)
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

    if(add)
    {
        addCategory()
        setAdd(false)
            // })
            // .catch((err) =>{
            // console.log("Error occured while uploading image"+err);
            // })
        // })
        // .catch((err)=>{console.log("Error occured while downloading the url"+err)})
    }

    function addCategory()
        {
            var newCategory = {
                category:form.category,
                categoryImage:form.categoryImage,
                subCategoryList:form.subCategoryList
            }
            axios.post("/categories/add",newCategory)
            .then(()=>{console.log("Category added by Admin")
            setAddSuccess(true)
            setAddFailure(false)
            setAdd(false)
            })
            .catch((err) => {console.log("Error occured while adding category:"+err)
            setAddSuccess(false)
            setAddFailure(true)
            })
        }

    // useEffect(() =>
    // {    
          
    // },[]);

    
    function handleChangeCategory(event)
    {
        // validateForm(true)
        if(event.target.value.length==0)
            setForm({...form,categoryErr:"Enter Category",category:event.target.value})
        else if (event.target.value.length<4)
            setForm({...form,categoryErr:"Category should contain atleast 4 characters",category:event.target.value})
        else if(!event.target.value.match(/^[a-zA-Z ]{4,}$/gm))
            setForm({...form,categoryErr:"Category should contain only characters",category:event.target.value})
        else
            setForm({...form,categoryErr:"",category:event.target.value})
        setCheckForm(true);
    }

    function handleChangeCategoryImage(event)
    {
        console.log(event.target.files[0]);
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
        console.log("1"+event.target.value);
        setNewSubCategory(event.target.value);
        console.log("2"+event.target.value);
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

    function handleAddCategory()
    {
        setAdd(true)
    }

    function handleAddNewSubCategory(event)
    {
        setForm({...form,subCategoryList:[...form.subCategoryList,newSubCategory],newSubCategoryErr:"init",subCategoryListErr:""});
        setNewSubCategory("");
        setCheckForm(true);
        console.log(form);
    }

    return(<div className="adminAddCategory">
        <form className="admin-form adminAddCategory-form" onSubmit={(e)=> e.preventDefault()}>
            <p className="adminForm-title">Add Category</p>
            <div class="form-group">
                <label for="category">Category Name</label>
                <input type="text" className="form-control category" id="category" onChange={handleChangeCategory} placeholder="Category Name" value={form.category}/>
                {form.categoryErr.length>0 && form.categoryErr!="init" && <p className="err adminErr">{form.categoryErr}</p>}
            </div>
            <div className="form-group">
                <label for="categoryImage">Category image</label>
                {form.categoryImage!="" && <img src={form.categoryImage} style={{display:"block",width:"200px",height:"200px",margin:"10px 0px"}}/>}
                <input type="file" className="categoryImage" id="categoryImage" onChange={handleChangeCategoryImage}  placeholder="Category Image" />
                {form.categoryImageErr.length>0  && form.categoryImageErr!="init" && <p className="err admin-err">{form.categoryImageErr}</p>}
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
                            // setCheckForm(true)
                            
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
                <button type="submit" className="addCategory-btn btn btn-primary" id="addCategory" onClick={handleAddCategory}  disabled={canBeSubmitted}>Add</button>
            </div>
            {addSuccess && <p className="successMsg">Category Added Successfully</p>}
            {addFailure && <p className="failureMsg">Please Try Again</p>}
       </form>
       </div>);
} 


export default AdminAddCategory;
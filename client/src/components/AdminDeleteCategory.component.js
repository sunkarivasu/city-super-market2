import axios from "axios";
import React,{useEffect, useState} from "react";
import "../css/style.css";
// import DeleteIcon from '@shapla/react-delete-icon';

function AdminDeleteCategory()
{
    var intialState = {
        category:"",
        categoryImage:"",
        subCategoryList:[],
        categoryErr:"init",
        //newSubCategoryErr:"init",
        //subCategoryListErr:""
    }

    var [form,setForm] = useState(intialState);
    var [categoryList,setCategoryList] = useState(null);
    var [categoryChanged,setCategoryChanged] = useState(false);
    // var [newSubCategory,setNewSubCategory] = useState("");
    // var [checkForm,setCheckForm] = useState(true);
    var [canBeSubmitted,setCanBeSubmitted] = useState(true);
    var [Delete,setDelete] = useState(false);
    var [deleteSuccess,setDeleteSuccess] = useState(false);
    var [deleteFailure,setDeleteFailure] = useState(false);
    // var [remove,setRemove] = useState(false)

    if(deleteSuccess)
    {
        setTimeout(()=>
        {
            setForm(intialState);
            // setNewSubCategory("");
            setCanBeSubmitted(true);
            setDeleteSuccess(false)
            setDeleteFailure(false)
        },3000);
    }


    useEffect(() =>
    {
        axios.get("/categories/")
        .then((res) => {setCategoryList(res.data)})
        .catch((err) => {console.log("Error while fetching categories:"+err)})

        if(categoryChanged)
        {
            axios.get("/categories//getCategoryDetails/"+form.category)
            .then((res)=>
            {
                setForm({...form,subCategoryList:res.data.subCategoryList,categoryImage:res.data.categoryImage})
            })
            .catch((err) => {console.log("Error while fetching sub categories to update:"+err)});
            setCategoryChanged(false)
        }

        // if(remove && form.subCategoryList.length==0)
        // {
        //     setForm({...form,subCategoryListErr:"Add atleast one Sub Category"})
        //     setRemove(false)
        //     setCanBeSubmitted(true);
        // }

        // if(checkForm)
        // {
        //     if (form.categoryErr=="" && form.subCategoryListErr=="")
        //     {
        //         setCanBeSubmitted(false)
        //     }
        //     else
        //     {
        //         setCanBeSubmitted(true)
        //     }
        //     setCheckForm(false)
        // }
        if(Delete)
        {
            // console.log("hi");
            axios.delete("/categories/deleteCategory/"+form.category)
            .then(()=>{console.log("Category updated by Admin")
            setDeleteSuccess(true)
            setDeleteFailure(false)
            setDelete(false)
            })
            .catch((err) => {console.log("Error occured while adding category:"+err)
            setDeleteSuccess(false)
            setDeleteFailure(true)
            })
        }
        
    })


    function handleChangeCategory(event)
    {
        console.log("category changed:"+event.target.value);
        if(event.target.value=="None")
        {
            setForm({...form,categoryErr:"Select Category",category:event.target.value,subCategoryListErr:"",newSubCategoryErr:"init"})
            setCanBeSubmitted(true)
        }
        else
        {
            setForm({...form,categoryErr:"",category:event.target.value,subCategoryListErr:"",newSubCategoryErr:"init"})
            setCanBeSubmitted(false);
        }
        //setCheckForm(true);
        //setNewSubCategory("");
        setCategoryChanged(true);

    }

    function handleChangeCategoryImage(event)
    {
        setForm({...form,categoryImage:event.target.value});
    }

    

    function handleDeleteCategory()
    {
        setDelete(true)
    }

    
    return(<div className="adminUpdateCategory">
         <form className="admin-form adminUpdateCategory-form" onSubmit={(e)=> e.preventDefault()}>
             <p className="adminForm-title">Delete Category</p>
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
                 {form.categoryImage!="" && <img style={{display:"block",width:"200px",height:"200px"}} src={form.categoryImage}/>}
                 {/* <input type="file" className="categoryImage" id="categoryImage" onChange={handleChangeCategoryImage}  placeholder="Category Image" /> */}
             </div>
             <div className="form-group">
                 <label for="subCategoryList">Sub Category List</label>
                 {form.subCategoryList.map((element)=>{
                     return <div className="oldCategory">
                         <p className="oldCategoryText">{element}</p>
                         
                     </div>
                 })}
                 
             </div>
             <div className="form-group">
                 <button type="submit" className="addCategory-btn btn btn-primary" id="addCategory" onClick={handleDeleteCategory}  disabled={canBeSubmitted}>Delete</button>
             </div>
             {deleteSuccess && <p className="successMsg">Category Deleted Successfully</p>}
             {deleteFailure && <p className="failureMsg">Please Try Again</p>}
        </form>
        </div>);
        
}

export default AdminDeleteCategory;


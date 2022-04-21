import react from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import Header from "./Header.component";
import Footer from "./footer";

function createCategoryItem(props)
{
    return (<CategoryItem key={props._id} image={props.categoryImage} name={props.categoryName}/>);
}

function CategoryItem(props)
{
    
    return (
        <div>
            <Link className="category-link" to={"/viewAll/"+props.name}>
                <div className="category-image">
                <img className="category-img" src={props.image}/>
                </div>
                <p className="category-name">{props.name}</p>
            </Link>
        </div>);
}

function Categories()
{
    var [categoryList,setCategoryList]=useState(null);
    
    
    useEffect(() => {
        axios.get("/categories/")
            .then((res) => {setCategoryList(res.data)})
            .catch((err) => console.log(err))
    },[]);
    

    if(categoryList)
    {
        return(
            <div className="categoryNavbar">
                <div className="categories flex-bar">
                    {categoryList.map(createCategoryItem)}
                </div>
            </div>
            
        ) 
    }
    else
    {
        return(<div className="categories">
            <p>Loading ...</p>
        </div>)
    }
    
}

export default Categories;
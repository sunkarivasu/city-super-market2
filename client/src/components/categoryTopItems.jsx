import React from "react";
import axios from "axios";
import {useEffect,useState} from "react";
import createList from "./List";


function CategoryTopItems()
{
    var [categoryList,setCategoryList] = useState(null);

    useEffect(() => {
        axios.get("/products/noOfProducts/6")
            .then((res) => setCategoryList(res.data))
            .catch(err => console.error(err))
    }, []);

        return <div className="categoryTopItems">
                    {categoryList?<div>{categoryList.map(createList)}</div>:
                    <p>Loading...</p>}
                </div>;
}

export default CategoryTopItems;


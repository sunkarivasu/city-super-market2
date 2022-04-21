import react from "react";
import {createItem,Item} from "./List.jsx";
import {useEffect,useState} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header.component.js";
import Footer from "./footer.jsx";
import LoginOrRegister from "./LoginOrRegister.component";


function CategoryItems(props)
{
    var navigate = useNavigate();
    var [items,setItems] = useState(null);
    let categoryName = useParams().categoryName;
    var [showDailogBox,setShowDailogBox] = useState(false);
    var [loggedIn,setLoggedIn] = useState(false);

    function handleLoggedIn()
    {
        setLoggedIn(true);
    }

    function handleLoggedOut()
    {
        setLoggedIn(false);
    }

    function handleClickLogin(event)
    {
       setShowDailogBox(true)
    }


    function handleCloseDailog(event)
    {
        console.log("closing")
        setShowDailogBox(false);
    }

    useEffect(() => {
        // axios.get("/checkUserToken",{headers:{Authorization:localStorage.getItem("token")}})
        //     .then(()=>
        //     {
                axios.get("/products/category/"+categoryName)
                .then((res) => {setItems(res.data)})
                .catch((err) => { console.log("Error"+err)});
            // })
            // .catch((err)=>
            // {
            //     navigate("../");
            // })
    return () => {}   
    },[])

    
        return(<div className="categoryItems">
            <Header handleClickLogin={handleClickLogin} loggedIn={loggedIn} handleLoggedOut={handleLoggedOut}/>
            <div className="category-container">
                {items?<div className="category-items row">
                    {items.map(createItem)}
                </div>:<div style={{marginLeft:"100px"}}>Loading...</div>}
            </div>
            <LoginOrRegister show={showDailogBox} handleCloseDailog={handleCloseDailog} handleLoggedIn={handleLoggedIn}/>
            <Footer/>
        </div>
        )
    
}

export default CategoryItems;
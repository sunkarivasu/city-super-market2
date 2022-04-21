import React,{useEffect, useState} from "react";
import Categories from "./categories.jsx";
import Carosuel from "./carousel.jsx";
import CategoryTopItems from "./categoryTopItems.jsx";
import Header from "./Header.component.js";
import Footer from "./footer.jsx";
import LoginOrRegister from "./LoginOrRegister.component.js";

function Home()
{
    var [showDailogBox,setShowDailogBox] = useState(false);
    var [loggedIn,setLoggedIn] = useState(false);

    // useEffect(() => {
    //     const confettiSettings = { target: 'my-canvas' };
    //     const confetti = new ConfettiGenerator(confettiSettings);
    //     confetti.render();
        
    // return () => confetti.clear();

    // },[])

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

    return(
            <div className="home">
                <Header handleClickLogin={handleClickLogin} loggedIn={loggedIn} handleLoggedOut={handleLoggedOut}/>
                <div className="home-container">
                    <Categories/>
                    <Carosuel/>
                    <CategoryTopItems/>
                    <LoginOrRegister show={showDailogBox} handleCloseDailog={handleCloseDailog} handleLoggedIn={handleLoggedIn}/>
                </div>
                <Footer/>
            </div>
    );
}

export default Home;

